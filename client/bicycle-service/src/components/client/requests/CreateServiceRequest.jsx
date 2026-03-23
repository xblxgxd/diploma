// client/bicycle-service/src/components/client/requests/CreateServiceRequest.jsx
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axiosConfig';

export default function CreateServiceRequest() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [centers, setCenters] = useState([]);
    const [loadingCenters, setLoadingCenters] = useState(true);
    const [services, setServices] = useState([]);
    const [availableComponents, setAvailableComponents] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);

    const preselectedCenterId = location.state?.serviceCenterId || '';
    const [serviceCenterId, setServiceCenterId] = useState(preselectedCenterId ? String(preselectedCenterId) : '');
    const [serviceId, setServiceId] = useState('');
    const [componentId, setComponentId] = useState('');

    const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    const [requestDate, setRequestDate] = useState(nowLocal);

    const [bikeModel, setBikeModel] = useState('');
    const [problemDescription, setProblemDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function loadCenters() {
        setLoadingCenters(true);
        try {
            const { data } = await api.get('/service-centers');
            const list = data?.serviceCenters || data || [];
            setCenters(list);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load service centers');
        } finally {
            setLoadingCenters(false);
        }
    }

    useEffect(() => {
        loadCenters();
        if (preselectedCenterId) setServiceCenterId(String(preselectedCenterId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!serviceCenterId) {
            setServices([]);
            setServiceId('');
            setComponentId('');
            setAvailableComponents([]);
            setLoadingServices(false);
            return;
        }

        let cancelled = false;

        async function loadServices() {
            setLoadingServices(true);
            setServices([]);
            setServiceId('');
            setComponentId('');
            setAvailableComponents([]);
            try {
                const { data } = await api.get('/workshop-services', {
                    params: {
                        serviceCenterId: Number(serviceCenterId),
                        includeComponents: true,
                        isActive: true,
                    },
                });
                if (cancelled) return;
                const list = Array.isArray(data) ? data : [];
                setServices(list);
            } catch (error) {
                if (!cancelled) {
                    console.error(error);
                    toast.error('Failed to load services for the selected center');
                    setServices([]);
                }
            } finally {
                if (!cancelled) setLoadingServices(false);
            }
        }

        loadServices();
        return () => {
            cancelled = true;
        };
    }, [serviceCenterId]);

    useEffect(() => {
        if (!serviceId) {
            setAvailableComponents([]);
            setComponentId('');
            return;
        }

        const selected = services.find((svc) => String(svc.id) === String(serviceId));
        const components = selected?.components || [];
        setAvailableComponents(components);
        if (componentId && !components.some((comp) => String(comp.id) === String(componentId))) {
            setComponentId('');
        }
    }, [serviceId, services, componentId]);

    async function submit(e) {
        e.preventDefault();

        if (!user) {
            toast.info('You need to sign in before creating a service request');
            navigate('/login', { replace: true, state: { from: '/requests/new' } });
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/serviceRequests', {
                serviceCenterId: Number(serviceCenterId),
                workshopServiceId: serviceId ? Number(serviceId) : null,
                componentId: componentId ? Number(componentId) : null,
                requestDate,
                bikeModel: bikeModel || null,
                problemDescription,
            });

            toast.success('Service request submitted');
            navigate('/requests');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to submit service request';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <h3 className="mb-3">Create service request</h3>
            <Card>
                <Card.Body>
                    {loadingCenters ? (
                        <div className="d-flex justify-content-center py-5"><Spinner /></div>
                    ) : (
                        <Form onSubmit={submit}>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Service center</Form.Label>
                                        <Form.Select
                                            value={serviceCenterId}
                                            onChange={(e) => setServiceCenterId(e.target.value)}
                                            required
                                            disabled={submitting}
                                        >
                                            <option value="">Select a service center</option>
                                            {centers.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Preferred date and time</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={requestDate}
                                            onChange={(e) => setRequestDate(e.target.value)}
                                            required
                                            disabled={submitting}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Service</Form.Label>
                                        <Form.Select
                                            value={serviceId}
                                            onChange={(e) => {
                                                setServiceId(e.target.value);
                                                setComponentId('');
                                            }}
                                            required
                                            disabled={submitting || !serviceCenterId || loadingServices || services.length === 0}
                                        >
                                            <option value="">
                                                {loadingServices ? 'Loading services...' : 'Select a service'}
                                            </option>
                                            {services.map((svc) => (
                                                <option key={svc.id} value={svc.id}>{svc.name}</option>
                                            ))}
                                        </Form.Select>
                                        {!loadingServices && serviceCenterId && services.length === 0 && (
                                            <div className="small text-muted mt-1">
                                                No workshop services are available for this center yet.
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Component (optional)</Form.Label>
                                        <Form.Select
                                            value={componentId}
                                            onChange={(e) => setComponentId(e.target.value)}
                                            disabled={submitting || !serviceId || loadingServices || availableComponents.length === 0}
                                        >
                                            <option value="">
                                                {availableComponents.length ? 'Select a component' : 'Components are not required'}
                                            </option>
                                            {availableComponents.map((comp) => (
                                                <option key={comp.id} value={comp.id}>
                                                    {comp.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {serviceId && !loadingServices && availableComponents.length === 0 && (
                                            <div className="small text-muted mt-1">
                                                This service does not have linked components.
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Bicycle model (optional)</Form.Label>
                                        <Form.Control
                                            value={bikeModel}
                                            onChange={(e) => setBikeModel(e.target.value)}
                                            disabled={submitting}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Describe the issue</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            value={problemDescription}
                                            onChange={(e) => setProblemDescription(e.target.value)}
                                            required
                                            disabled={submitting}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="mt-3">
                                <Button type="submit" disabled={submitting || loadingServices}>
                                    {submitting ? 'Submitting...' : 'Submit request'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </>
    );
}