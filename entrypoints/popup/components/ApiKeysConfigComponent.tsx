import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import styles from './ApiKeysConfigComponent.module.css';
import { DragSvgIcon } from './icons/dragSvgIcon';
import { RemoveSvgIcon } from './icons/RemoveSvgIcon';

interface Model {
    id: number;
    name: string;
}

interface ApiKeyConfig {
    modelName: string;
    apiKey: string;
}

const models: Model[] = [
    { id: 1, name: 'Model A' },
    { id: 2, name: 'Model B' },
    { id: 3, name: 'Model C' }
];

const ApiKeysConfigComponent: React.FC = () => {
    const [selectedModel, setSelectedModel] = useState<number | null>(null);
    const [apiKey, setApiKey] = useState<string>('');
    const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([]);

    const handleAddApiKey = () => {
        if (selectedModel !== null && apiKey.trim() !== '') {
            const model = models.find(m => m.id === selectedModel);
            if (model && !apiKeys.some(item => item.modelName === model.name)) {
                setApiKeys([...apiKeys, { modelName: model.name, apiKey }]);
                setSelectedModel(null);
                setApiKey('');
            }
        }
    };

    const handleInputChange = (index: number, value: string) => {
        const newApiKeys = [...apiKeys];
        newApiKeys[index].apiKey = value;
        setApiKeys(newApiKeys);
    };

    const handleRemoveApiKey = (index: number) => {
        const newApiKeys = apiKeys.filter((_, i) => i !== index);
        setApiKeys(newApiKeys);
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedApiKeys = Array.from(apiKeys);
        const [removed] = reorderedApiKeys.splice(result.source.index, 1);
        reorderedApiKeys.splice(result.destination.index, 0, removed);
        setApiKeys(reorderedApiKeys);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>API 管理</h2>
            <p className={styles.operation}>
                <select onChange={e => setSelectedModel(Number(e.target.value))} value={selectedModel || ''}>
                    <option value="" disabled>选择API提供方</option>
                    {models.map(model => (
                        <option key={model.id} value={model.id} disabled={apiKeys.some(item => item.modelName === model.name)}>
                            {model.name}
                        </option>
                    ))}
                </select>
                <input
                    className={styles.input}
                    type="text"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="输入 API key"
                    disabled={selectedModel === null}
                />
                <button className={styles.button} onClick={handleAddApiKey} disabled={selectedModel === null || apiKey.trim() === ''}>
                    添加
                </button>
            </p>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef} className={styles.list}>
                            {apiKeys.map((item, index) => (
                                <Draggable key={item.modelName} draggableId={item.modelName} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={styles.listItem}
                                        >
                                            <span
                                                {...provided.dragHandleProps}
                                                className={styles.dragHandle}
                                                title="拖拽排序"
                                            >
                                                <DragSvgIcon className={styles.dragBtn} style={{fontSize: '24px'}}/> {/* 拖拽图标 */}
                                            </span>
                                            <label>{item.modelName}</label>
                                            <input
                                                className={styles.input}
                                                type="text"
                                                value={item.apiKey}
                                                onChange={e => handleInputChange(index, e.target.value)}
                                                placeholder="Enter API key"
                                            />
                                            <button className={styles.removeButton} onClick={() => handleRemoveApiKey(index)}>
                                                <RemoveSvgIcon style={{fontSize: '16px'}}/>
                                            </button>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default ApiKeysConfigComponent;
