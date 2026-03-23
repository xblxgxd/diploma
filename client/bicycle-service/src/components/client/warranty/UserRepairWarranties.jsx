import React, { useEffect, useState } from 'react';
import { Badge, Card, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axiosConfig';

const STATUS_LABELS = {
    active: 'Active',
    expired: 'Expired',
    void: 'Voided',
};

const STATUS_VARIANTS = {
    active: 'success',
    expired: 'secondary',
    void: 'warning',
};

function formatDate(value) {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString();
}

export default function UserRepairWarranties() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [warranties, setWarranties] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!user) {
                setWarranties([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const { data } = await api.get('/repair-warranties', { params: { userId: user.id } });
                if (!cancelled) {
                    setWarranties(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error(error);
                    toast.error('Failed to load repair warranties');
                    setWarranties([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    const renderStatusBadge = (status) => (
        <Badge bg={STATUS_VARIANTS[status] || 'secondary'}>
            {STATUS_LABELS[status] || status}
        </Badge>
    );

    const renderServiceName = (warranty) => {
        if (warranty.workshopService?.name) return warranty.workshopService.name;
        return warranty.serviceRequest?.workshopService?.name || 'N/A';
    };

    const renderComponentName = (warranty) => {
        return warranty.serviceRequest?.component?.name || 'N/A';
    };

    return (
        <>
            <h3 className="mb-3">Repair warranties</h3>
            <Card>
                <Card.Body>
                    {loading ? (
                        <div className="d-flex justify-content-center py-5"><Spinner /></div>
                    ) : warranties.length === 0 ? (
                        <div className="text-muted">No repair warranties yet.</div>
                    ) : (
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Service center</th>
                                    <th>Request</th>
                                    <th>Service</th>
                                    <th>Component</th>
                                    <th>Coverage</th>
                                    <th>Term</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {warranties.map((warranty) => {
                                    const centerName = warranty.serviceRequest?.serviceCenter?.name || 'N/A';
                                    const requestId = warranty.serviceRequestId ? `Request #${warranty.serviceRequestId}` : 'N/A';
                                    const coverage = warranty.coverageDescription || 'N/A';
                                    const period = warranty.warrantyPeriodMonths ? `${warranty.warrantyPeriodMonths} months` : 'N/A';
                                    const dates = `${formatDate(warranty.startDate)} — ${formatDate(warranty.endDate)}`;

                                    return (
                                        <tr key={warranty.id}>
                                            <td>{warranty.id}</td>
                                            <td>{centerName}</td>
                                            <td>{requestId}</td>
                                            <td>{renderServiceName(warranty)}</td>
                                            <td>{renderComponentName(warranty)}</td>
                                            <td>
                                                <div>{coverage}</div>
                                                {warranty.conditions && (
                                                    <div className="text-muted small">Conditions: {warranty.conditions}</div>
                                                )}
                                            </td>
                                            <td>
                                                <div>{period}</div>
                                                <div className="text-muted small">{dates}</div>
                                            </td>
                                            <td>{renderStatusBadge(warranty.status)}</td>
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