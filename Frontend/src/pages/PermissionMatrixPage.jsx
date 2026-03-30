import React, { useEffect, useState } from 'react';
import { getPermissions, updatePermissions } from '../api/permissions';

export default function PermissionMatrixPage() {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const res = await getPermissions();
            if (res.success) {
                setConfig(res.data);
            } else {
                setError(res.message || 'Failed to fetch permissions');
            }
        } catch (err) {
            setError(err.message || 'Error communicating with server');
        } finally {
            setLoading(false);
        }
    }

    const handleToggle = (role, resource, action) => {
        setConfig((prevConfig) => {
            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            const currentAllowed = newConfig.roles[role][resource][action].allowed;
            newConfig.roles[role][resource][action].allowed = !currentAllowed;
            return newConfig;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await updatePermissions(config);
            if (res.success) {
                setConfig(res.data);
                alert('Permissions saved successfully!');
            } else {
                setError(res.message || 'Failed to save permissions');
            }
        } catch (err) {
            setError(err.message || 'Error saving changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!config) return <div className="error-text">No permission data found: {error}</div>;

    const { roles } = config;
    const roleNames = Object.keys(roles);
    // Extract all resources from the first role (assuming all roles have same resources structure)
    const resourceNames = Object.keys(roles[roleNames[0]] || {});

    return (
        <div className="page-container" style={{ padding: '2rem' }}>
            <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Role Permission Matrix</h1>
                    <p className="page-subtitle">Configure which roles can perform specific actions.</p>
                </div>
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

            <div className="card matrix-card" style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #ccc' }}>Resource / Action</th>
                            {roleNames.map((role) => (
                                <th key={role} style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid #ccc', textTransform: 'capitalize' }}>
                                    {role}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {resourceNames.map((resource) => {
                            const actionNames = Object.keys(roles[roleNames[0]][resource]);
                            return (
                                <React.Fragment key={resource}>
                                    {/* Category HeaderRow */}
                                    <tr>
                                        <td colSpan={roleNames.length + 1} style={{ backgroundColor: '#f5f5f5', padding: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem' }}>
                                            {resource}
                                        </td>
                                    </tr>

                                    {actionNames.map((action) => (
                                        <tr key={`${resource}-${action}`}>
                                            <td style={{ padding: '0.75rem', paddingLeft: '2rem', borderBottom: '1px solid #eee' }}>
                                                {action.replace('_', ' ')}
                                            </td>
                                            {roleNames.map((role) => {
                                                const perm = roles[role]?.[resource]?.[action];
                                                if (!perm) return <td key={role} style={{ borderBottom: '1px solid #eee' }}></td>;

                                                return (
                                                    <td key={role} style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                                                        <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={perm.allowed}
                                                                onChange={() => handleToggle(role, resource, action)}
                                                                style={{ transform: 'scale(1.2)' }}
                                                            />
                                                        </label>
                                                        {perm.condition && (
                                                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }} title={perm.condition}>
                                                                Has conditions (hover)
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
