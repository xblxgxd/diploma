const { RepairWarranty, ServiceRequest, WorkshopService, Component, ServiceCenter, sequelize } = require('../models/models');
const { Op } = require('sequelize');

const STATUS_VALUES = ['active', 'expired', 'void'];
const WARRANTY_INCLUDE = [
    {
        model: ServiceRequest,
        as: 'serviceRequest',
        required: true,
        include: [
            { model: ServiceCenter, attributes: ['id', 'name', 'contactPerson', 'phone'] },
            { model: WorkshopService, as: 'workshopService', attributes: ['id', 'name', 'category', 'basePrice'] },
            { model: Component, as: 'component', attributes: ['id', 'name', 'manufacturer', 'unit'] },
        ],
    },
    { model: WorkshopService, as: 'workshopService', attributes: ['id', 'name', 'category', 'basePrice'] },
];function cloneInclude(include) {
    return include.map((item) => ({
        ...item,
        include: item.include ? cloneInclude(item.include) : undefined,
    }));
}




function parseDate(value, fieldName) {
    if (value === undefined || value === null || value === '') return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        throw new Error(`${fieldName} ����� �������� ������ ����`);
    }
    return parsed;
}

class RepairWarrantyController {
    async create(req, res) {
        try {
            const serviceCenterId = req.user?.serviceCenterId;
            if (!serviceCenterId) {
                return res.status(401).json({ message: '��������� ����������� ���������� ������' });
            }

            const {
                serviceRequestId,
                workshopServiceId,
                coverageDescription,
                warrantyPeriodMonths,
                conditions,
                status = 'active',
                startDate,
                endDate,
            } = req.body;

            if (!serviceRequestId || !coverageDescription || warrantyPeriodMonths === undefined || !startDate || !endDate) {
                return res.status(400).json({
                    message: 'serviceRequestId, coverageDescription, warrantyPeriodMonths, startDate � endDate �����������',
                });
            }

            const requestId = Number(serviceRequestId);
            if (!Number.isInteger(requestId)) {
                return res.status(400).json({ message: 'serviceRequestId ������ ���� ����� ������' });
            }

            const warrantyMonths = Number(warrantyPeriodMonths);
            if (!Number.isFinite(warrantyMonths) || warrantyMonths <= 0) {
                return res.status(400).json({ message: 'warrantyPeriodMonths ������ ���� ������������� ������' });
            }

            const parsedStart = parseDate(startDate, 'startDate');
            const parsedEnd = parseDate(endDate, 'endDate');
            if (parsedStart && parsedEnd && parsedStart > parsedEnd) {
                return res.status(400).json({ message: 'startDate �� ����� ���� ����� endDate' });
            }

            if (!STATUS_VALUES.includes(status)) {
                return res.status(400).json({ message: '������������ ������ ��������' });
            }

            const serviceRequest = await ServiceRequest.findByPk(requestId);
            if (!serviceRequest) {
                return res.status(404).json({ message: '������ �� ������ �� �������' });
            }
            if (serviceRequest.serviceCenterId !== serviceCenterId) {
                return res.status(403).json({ message: '���������� �������� �������� ��� ����� ������' });
            }

            let serviceId = null;
            if (workshopServiceId !== undefined && workshopServiceId !== null && workshopServiceId !== '') {
                serviceId = Number(workshopServiceId);
                if (!Number.isInteger(serviceId)) {
                    return res.status(400).json({ message: 'workshopServiceId ������ ���� ����� ������' });
                }
                const workshopService = await WorkshopService.findByPk(serviceId);
                if (!workshopService || workshopService.serviceCenterId !== serviceCenterId) {
                    return res.status(400).json({ message: '��������� ������ ���������� ����������' });
                }
            }

            const warranty = await RepairWarranty.create({
                serviceCenterId,
                serviceRequestId: requestId,
                workshopServiceId: serviceId,
                coverageDescription: String(coverageDescription).trim(),
                warrantyPeriodMonths: Math.round(warrantyMonths),
                conditions: conditions ? String(conditions).trim() : null,
                status,
                startDate: parsedStart,
                endDate: parsedEnd,
            });

            const withRelations = await RepairWarranty.findByPk(warranty.id, {
                include: cloneInclude(WARRANTY_INCLUDE),
            });

            return res.status(201).json(withRelations);
        } catch (error) {
            console.error('������ ��� �������� �������� �� ������:', error);
            return res.status(500).json({ message: error.message || '���������� ������ �������' });
        }
    }

    async findAll(req, res) {
        try {
            const { serviceCenterId, serviceRequestId, status, userId } = req.query;
            const where = {};
            const include = cloneInclude(WARRANTY_INCLUDE);


            if (serviceCenterId !== undefined) {
                const scId = Number(serviceCenterId);
                if (!Number.isInteger(scId)) {
                    return res.status(400).json({ message: 'serviceCenterId ������ ���� ����� ������' });
                }
                where.serviceCenterId = scId;
            }
            if (serviceRequestId !== undefined) {
                const requestId = Number(serviceRequestId);
                if (!Number.isInteger(requestId)) {
                    return res.status(400).json({ message: 'serviceRequestId ������ ���� ����� ������' });
                }
                where.serviceRequestId = requestId;
            }
            if (status) {
                if (!STATUS_VALUES.includes(status)) {
                    return res.status(400).json({ message: '������������ ������' });
                }
                where.status = status;
            }
            if (userId !== undefined) {
                const parsedUserId = Number(userId);
                if (!Number.isInteger(parsedUserId)) {
                    return res.status(400).json({ message: 'userId ������ ���� 楫� �᫮�' });
                }
                include[0].where = { ...(include[0].where || {}), userId: parsedUserId };
            }

            const warranties = await RepairWarranty.findAll({
                where,
                include,
                order: [['startDate', 'DESC']],
            });

            return res.json(warranties);
        } catch (error) {
            console.error('������ ��� ��������� �������� �� ������:', error);
            return res.status(500).json({ message: '���������� ������ �������' });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;
            const warranty = await RepairWarranty.findByPk(id, {
                include: cloneInclude(WARRANTY_INCLUDE),
            });
            if (!warranty) {
                return res.status(404).json({ message: '�������� �� ������ �� �������' });
            }
            return res.json(warranty);
        } catch (error) {
            console.error('������ ��� ��������� �������� �� ������:', error);
            return res.status(500).json({ message: '���������� ������ �������' });
        }
    }

    async update(req, res) {
        try {
            const serviceCenterId = req.user?.serviceCenterId;
            if (!serviceCenterId) {
                return res.status(401).json({ message: '��������� ����������� ���������� ������' });
            }

            const { id } = req.params;
            const warranty = await RepairWarranty.findByPk(id);
            if (!warranty) {
                return res.status(404).json({ message: '�������� �� ������ �� �������' });
            }
            if (warranty.serviceCenterId !== serviceCenterId) {
                return res.status(403).json({ message: '��� ������� � ��������� ���� ��������' });
            }

            const {
                coverageDescription,
                warrantyPeriodMonths,
                conditions,
                status,
                startDate,
                endDate,
                workshopServiceId,
            } = req.body;

            const payload = {};
            if (coverageDescription !== undefined) payload.coverageDescription = String(coverageDescription).trim();
            if (warrantyPeriodMonths !== undefined) {
                const months = Number(warrantyPeriodMonths);
                if (!Number.isFinite(months) || months <= 0) {
                    return res.status(400).json({ message: 'warrantyPeriodMonths ������ ���� ������������� ������' });
                }
                payload.warrantyPeriodMonths = Math.round(months);
            }
            if (conditions !== undefined) payload.conditions = conditions ? String(conditions).trim() : null;
            if (status !== undefined) {
                if (!STATUS_VALUES.includes(status)) {
                    return res.status(400).json({ message: '������������ ������ ��������' });
                }
                payload.status = status;
            }
            if (startDate !== undefined) payload.startDate = parseDate(startDate, 'startDate');
            if (endDate !== undefined) payload.endDate = parseDate(endDate, 'endDate');
            if (payload.startDate && payload.endDate && payload.startDate > payload.endDate) {
                return res.status(400).json({ message: 'startDate �� ����� ���� ����� endDate' });
            }

            if (workshopServiceId !== undefined) {
                if (workshopServiceId === null || workshopServiceId === '') {
                    payload.workshopServiceId = null;
                } else {
                    const serviceId = Number(workshopServiceId);
                    if (!Number.isInteger(serviceId)) {
                        return res.status(400).json({ message: 'workshopServiceId ������ ���� ����� ������' });
                    }
                    const workshopService = await WorkshopService.findByPk(serviceId);
                    if (!workshopService || workshopService.serviceCenterId !== serviceCenterId) {
                        return res.status(400).json({ message: '��������� ������ ���������� ����������' });
                    }
                    payload.workshopServiceId = serviceId;
                }
            }

            await warranty.update(payload);

            const withRelations = await RepairWarranty.findByPk(warranty.id, {
                include: cloneInclude(WARRANTY_INCLUDE),
            });

            return res.json(withRelations);
        } catch (error) {
            console.error('������ ��� ���������� �������� �� ������:', error);
            return res.status(500).json({ message: error.message || '���������� ������ �������' });
        }
    }

    async delete(req, res) {
        try {
            const serviceCenterId = req.user?.serviceCenterId;
            if (!serviceCenterId) {
                return res.status(401).json({ message: '��������� ����������� ���������� ������' });
            }

            const { id } = req.params;
            const warranty = await RepairWarranty.findByPk(id);
            if (!warranty) {
                return res.status(404).json({ message: '�������� �� ������ �� �������' });
            }
            if (warranty.serviceCenterId !== serviceCenterId) {
                return res.status(403).json({ message: '��� ������� � �������� ���� ��������' });
            }

            await warranty.destroy();
            return res.json({ message: '�������� �� ������ �������' });
        } catch (error) {
            console.error('������ ��� �������� �������� �� ������:', error);
            return res.status(500).json({ message: '���������� ������ �������' });
        }
    }
}

module.exports = new RepairWarrantyController();
