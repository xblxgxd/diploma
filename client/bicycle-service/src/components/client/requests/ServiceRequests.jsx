import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

const API = process.env.REACT_APP_API_URL || '/api';

const statusColor = (s) => ({
    'запрошена': 'secondary',
    'в работе': 'info',
    'выполнена': 'success',
    'отменена': 'danger'
}[s] || 'secondary');

export default function ServiceRequests() {
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    async function load() {
        if (!user) {
            setItems([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API}/serviceRequests?userId=${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            setItems(await res.json());
        } catch (error) {
            console.error(error);
            toast.error('Failed to load service requests');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, token]);

    async function cancel(id) {
        if (!window.confirm('Cancel this service request?')) return;
        try {
            const res = await fetch(`${API}/servicerequests/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            toast.success('Service request cancelled');
            await load();
        } catch (error) {
            console.error(error);
            toast.error('Unable to cancel the request');
        }
    }

    if (loading) {
        return <div className="d-flex justify-content-center py-5"><Spinner /></div>;
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="m-0">My service requests</h3>
                <Button as={Link} to="/requests/new">Create request</Button>
            </div>

            <Card>
                <Card.Body>
                    {items.length === 0 ? (
                        <div className="text-muted">No requests yet</div>
                    ) : (
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Service center</th>
                                    <th>Requested at</th>
                                    <th>Service</th>
                                    <th>Component</th>
                                    <th>Status</th>
                                    <th>Description</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((r) => {
                                    const serviceCenterName = r.ServiceCenter?.name || 'N/A';
                                    const serviceName = r.workshopService?.name || (r.workshopServiceId ? `Service #${r.workshopServiceId}` : 'N/A');
                                    const componentName = r.component?.name || (r.componentId ? `Component #${r.componentId}` : 'N/A');
                                    const requestedAt = r.requestDate ? new Date(r.requestDate).toLocaleString() : 'N/A';

                                    return (
                                        <tr key={r.id}>
                                            <td>{r.id}</td>
                                            <td>{serviceCenterName}</td>
                                            <td>{requestedAt}</td>
                                            <td>{serviceName}</td>
                                            <td>{componentName}</td>
                                            <td><Badge bg={statusColor(r.status)}>{r.status}</Badge></td>
                                            <td className="text-truncate" style={{ maxWidth: 260 }}>{r.problemDescription}</td>
                                            <td className="text-end">
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => cancel(r.id)}
                                                >
                                                    Cancel
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </>
    );
}