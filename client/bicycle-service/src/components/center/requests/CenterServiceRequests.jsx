// src/components/center/requests/CenterServiceRequests.jsx
import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axiosConfig';

const STATUSES = ['запрошена', 'в работе', 'выполнена', 'отменена'];

export default function CenterServiceRequests() {
    const { center, centerLoading } = useAuth();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [notesDrafts, setNotesDrafts] = useState({});

    async function load() {
        if (!center) {
            setItems([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const params = { serviceCenterId: center.id };
            if (filter) params.status = filter;
            const { data } = await api.get('/serviceRequests', { params });
            setItems(Array.isArray(data) ? data : []);
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
    }, [center, filter]);

    async function updateStatus(id, status) {
        try {
            await api.put(`/serviceRequests/${id}`, { status });
            toast.success('Status updated');
            await load();
        } catch (error) {
            console.error(error);
            toast.error('Unable to update status');
        }
    }

    async function updateNotes(id) {
        const technicianNotes = notesDrafts[id] ?? '';
        try {
            await api.put(`/serviceRequests/${id}`, { technicianNotes });
            toast.success('Technician notes saved');
            await load();
        } catch (error) {
            console.error(error);
            toast.error('Unable to save technician notes');
        }
    }

    async function remove(id) {
        if (!window.confirm('Delete this service request?')) return;
        try {
            await api.delete(`/serviceRequests/${id}`);
            toast.success('Service request deleted');
            await load();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete the request');
        }
    }

    if (centerLoading || loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    if (!center) return <div>Service center account required</div>;

    return (
        <>
            <h3 className="mb-3">Incoming service requests</h3>

            <div className="d-flex gap-2 align-items-center mb-2">
                <div>Status filter:</div>
                <Form.Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ maxWidth: 240 }}
                >
                    <option value="">All</option>
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </Form.Select>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Requested at</th>
                        <th>Customer</th>
                        <th>Bike model</th>
                        <th>Service</th>
                        <th>Component</th>
                        <th>Problem description</th>
                        <th>Status</th>
                        <th>Technician notes</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((r, i) => {
                        const draft = notesDrafts[r.id] ?? r.technicianNotes ?? '';
                        const requestedAt = r.requestDate ? new Date(r.requestDate).toLocaleString() : 'N/A';
                        const customerName = r.User ? `${r.User.firstName} ${r.User.lastName}` : 'N/A';
                        const bikeModel = r.bikeModel || 'N/A';
                        const serviceName = r.workshopService?.name || (r.workshopServiceId ? `Service #${r.workshopServiceId}` : 'N/A');
                        const componentName = r.component?.name || (r.componentId ? `Component #${r.componentId}` : 'N/A');
                        const problemDescription = r.problemDescription || 'N/A';

                        return (
                            <tr key={r.id}>
                                <td>{i + 1}</td>
                                <td>{requestedAt}</td>
                                <td>{customerName}</td>
                                <td>{bikeModel}</td>
                                <td>{serviceName}</td>
                                <td>{componentName}</td>
                                <td style={{ maxWidth: 260 }}>{problemDescription}</td>
                                <td style={{ minWidth: 180 }}>
                                    <Form.Select
                                        size="sm"
                                        value={r.status}
                                        onChange={(e) => updateStatus(r.id, e.target.value)}
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </td>
                                <td style={{ minWidth: 240 }}>
                                    <Form.Control
                                        size="sm"
                                        value={draft}
                                        onChange={(e) =>
                                            setNotesDrafts((m) => ({ ...m, [r.id]: e.target.value }))
                                        }
                                        onBlur={() => updateNotes(r.id)}
                                        placeholder="Add technician notes"
                                    />
                                </td>
                                <td className="text-nowrap">
                                    <Button size="sm" variant="outline-danger" onClick={() => remove(r.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
}