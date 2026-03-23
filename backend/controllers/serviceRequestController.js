const { ServiceRequest, User, ServiceCenter, WorkshopService, Component, ServiceComponent } = require('../models/models');


const STATUS_VALUES = ServiceRequest?.rawAttributes?.status?.values || ['pending', 'processing', 'completed', 'cancelled'];
const DEFAULT_STATUS = STATUS_VALUES[0];

class ValidationError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

const SERVICE_REQUEST_INCLUDE = [
    { model: User, attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
    { model: ServiceCenter, attributes: ['id', 'name', 'contactPerson', 'phone'] },
    { model: WorkshopService, as: 'workshopService', attributes: ['id', 'name', 'category', 'basePrice'] },
    { model: Component, as: 'component', attributes: ['id', 'name', 'manufacturer', 'unit'] },
];

async function resolveServiceSelection(serviceCenterId, workshopServiceIdRaw, componentIdRaw) {
    const centerId = Number(serviceCenterId);
    let workshopServiceId = null;
    let componentId = null;

    const hasService = workshopServiceIdRaw !== undefined && workshopServiceIdRaw !== null && workshopServiceIdRaw !== '';
    const hasComponent = componentIdRaw !== undefined && componentIdRaw !== null && componentIdRaw !== '';

    if (hasService) {
        const parsedServiceId = Number(workshopServiceIdRaw);
        if (!Number.isInteger(parsedServiceId)) {
            throw new ValidationError('workshopServiceId must be an integer');
        }

        const service = await WorkshopService.findOne({ where: { id: parsedServiceId, serviceCenterId: centerId } });
        if (!service) {
            throw new ValidationError('Selected workshop service does not belong to the specified service center');
        }
        workshopServiceId = service.id;

        if (hasComponent) {
            const parsedComponentId = Number(componentIdRaw);
            if (!Number.isInteger(parsedComponentId)) {
                throw new ValidationError('componentId must be an integer');
            }

            const component = await Component.findOne({ where: { id: parsedComponentId, serviceCenterId: centerId } });
            if (!component) {
                throw new ValidationError('Selected component does not belong to the specified service center');
            }

            const link = await ServiceComponent.findOne({ where: { workshopServiceId: service.id, componentId: component.id } });
            if (!link) {
                throw new ValidationError('Component is not linked to the selected workshop service');
            }

            componentId = component.id;
        }
    } else if (hasComponent) {
        throw new ValidationError('componentId cannot be provided without workshopServiceId');
    }

    return { workshopServiceId, componentId };
}

function isValidDate(d) {
    return d instanceof Date && !Number.isNaN(d.valueOf());
}
class ServiceRequestController {
    async createServiceRequest(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const {
                serviceCenterId,
                requestDate,
                problemDescription,
                bikeModel,
                workshopServiceId: workshopServiceIdRaw,
                componentId: componentIdRaw,
            } = req.body;

            if (!serviceCenterId || !requestDate || !problemDescription) {
                return res.status(400).json({ message: 'Missing required fields: serviceCenterId, requestDate, problemDescription' });
            }

            const centerId = Number(serviceCenterId);
            if (!Number.isInteger(centerId)) {
                return res.status(400).json({ message: 'serviceCenterId must be an integer' });
            }

            const center = await ServiceCenter.findByPk(centerId);
            if (!center) {
                return res.status(404).json({ message: 'Service center not found' });
            }

            const parsedDate = new Date(requestDate);
            if (!isValidDate(parsedDate)) {
                return res.status(400).json({ message: 'requestDate must be a valid date' });
            }

            const { workshopServiceId, componentId } = await resolveServiceSelection(
                centerId,
                workshopServiceIdRaw,
                componentIdRaw,
            );

            const newRequest = await ServiceRequest.create({
                userId,
                serviceCenterId: centerId,
                workshopServiceId,
                componentId,
                requestDate: parsedDate,
                status: DEFAULT_STATUS,
                bikeModel: bikeModel || null,
                problemDescription,
                technicianNotes: null,
            });

            const createdWithRelations = await ServiceRequest.findByPk(newRequest.id, {
                include: SERVICE_REQUEST_INCLUDE,
            });

            return res.status(201).json(createdWithRelations);
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(error.status).json({ message: error.message });
            }
            console.error('Error while creating service request:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getServiceRequestById(req, res) {
        try {
            const { id } = req.params;
            const request = await ServiceRequest.findByPk(id, {
                include: SERVICE_REQUEST_INCLUDE,
            });

            if (!request) {
                return res.status(404).json({ message: 'Service request not found' });
            }
            return res.json(request);
        } catch (error) {
            console.error('Error while retrieving service request:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllServiceRequests(req, res) {
        try {
            const { userId, serviceCenterId, status } = req.query;
            const where = {};

            if (userId !== undefined) {
                const uid = Number(userId);
                if (!Number.isInteger(uid)) {
                    return res.status(400).json({ message: 'userId must be an integer' });
                }
                where.userId = uid;
            }
            if (serviceCenterId !== undefined) {
                const scid = Number(serviceCenterId);
                if (!Number.isInteger(scid)) {
                    return res.status(400).json({ message: 'serviceCenterId must be an integer' });
                }
                where.serviceCenterId = scid;
            }
            if (status) {
                if (!STATUS_VALUES.includes(status)) {
                    return res.status(400).json({ message: 'Invalid status value' });
                }
                where.status = status;
            }

            const requests = await ServiceRequest.findAll({
                where,
                include: SERVICE_REQUEST_INCLUDE,
                order: [['requestDate', 'DESC']],
            });

            return res.json(requests);
        } catch (error) {
            console.error('Error while listing service requests:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateServiceRequest(req, res) {
        try {
            const { id } = req.params;
            const {
                status,
                technicianNotes,
                problemDescription,
                bikeModel,
                requestDate,
                workshopServiceId: workshopServiceIdRaw,
                componentId: componentIdRaw,
            } = req.body;

            const request = await ServiceRequest.findByPk(id);
            if (!request) {
                return res.status(404).json({ message: 'Service request not found' });
            }

            const currentUserId = req.user?.userId;
            const currentServiceCenterId = req.user?.serviceCenterId;

            if (currentUserId && request.userId === currentUserId) {
                if (status !== undefined || technicianNotes !== undefined) {
                    return res.status(403).json({ message: 'Customers cannot change status or technician notes' });
                }

                const updatedData = {};
                if (problemDescription !== undefined) updatedData.problemDescription = problemDescription;
                if (bikeModel !== undefined) updatedData.bikeModel = bikeModel;
                if (requestDate !== undefined) {
                    const parsed = new Date(requestDate);
                    if (!isValidDate(parsed)) {
                        return res.status(400).json({ message: 'requestDate must be a valid date' });
                    }
                    updatedData.requestDate = parsed;
                }

                if (workshopServiceIdRaw !== undefined || componentIdRaw !== undefined) {
                    let serviceCandidate = workshopServiceIdRaw !== undefined ? workshopServiceIdRaw : request.workshopServiceId;
                    let componentCandidate;
                    if (workshopServiceIdRaw !== undefined) {
                        componentCandidate = componentIdRaw !== undefined ? componentIdRaw : null;
                    } else {
                        componentCandidate = componentIdRaw !== undefined ? componentIdRaw : request.componentId;
                    }

                    const selection = await resolveServiceSelection(
                        request.serviceCenterId,
                        serviceCandidate,
                        componentCandidate,
                    );
                    updatedData.workshopServiceId = selection.workshopServiceId;
                    updatedData.componentId = selection.componentId;
                }

                await request.update(updatedData);
                await request.reload({ include: SERVICE_REQUEST_INCLUDE });
                return res.json(request);
            }

            if (currentServiceCenterId && request.serviceCenterId === currentServiceCenterId) {
                const updatedData = {};
                if (status !== undefined) {
                    if (!STATUS_VALUES.includes(status)) {
                        return res.status(400).json({ message: 'Invalid status value' });
                    }
                    updatedData.status = status;
                }
                if (technicianNotes !== undefined) updatedData.technicianNotes = technicianNotes;

                if (workshopServiceIdRaw !== undefined || componentIdRaw !== undefined) {
                    let serviceCandidate = workshopServiceIdRaw !== undefined ? workshopServiceIdRaw : request.workshopServiceId;
                    let componentCandidate;
                    if (workshopServiceIdRaw !== undefined) {
                        componentCandidate = componentIdRaw !== undefined ? componentIdRaw : null;
                    } else {
                        componentCandidate = componentIdRaw !== undefined ? componentIdRaw : request.componentId;
                    }

                    const selection = await resolveServiceSelection(
                        request.serviceCenterId,
                        serviceCandidate,
                        componentCandidate,
                    );
                    updatedData.workshopServiceId = selection.workshopServiceId;
                    updatedData.componentId = selection.componentId;
                }

                await request.update(updatedData);
                await request.reload({ include: SERVICE_REQUEST_INCLUDE });
                return res.json(request);
            }

            return res.status(403).json({ message: 'Access denied' });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(error.status).json({ message: error.message });
            }
            console.error('Error while updating service request:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteServiceRequest(req, res) {
        try {
            const { id } = req.params;
            const request = await ServiceRequest.findByPk(id);
            if (!request) {
                return res.status(404).json({ message: 'Service request not found' });
            }

            const currentUserId = req.user?.userId;
            const currentServiceCenterId = req.user?.serviceCenterId;

            if (
                (currentUserId && request.userId === currentUserId) ||
                (currentServiceCenterId && request.serviceCenterId === currentServiceCenterId)
            ) {
                await request.destroy();
                return res.status(200).json({ message: 'Service request deleted' });
            }

            return res.status(403).json({ message: 'Access denied' });
        } catch (error) {
            console.error('Error while deleting service request:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ServiceRequestController();
