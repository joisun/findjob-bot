import { AgentsType, AiAgentApiKeys } from '@/typings/aiModelAdaptor';
import { agentsStorage } from '@/utils/storage';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import React, { useState } from 'react';
import styles from './ApiKeysConfigComponent.module.css';
import HeadlingTitle from './common/HeadlingTitle';
import Subtitle from './common/Subtitle';
import { DragSvgIcon } from './icons/dragSvgIcon';
import { RemoveSvgIcon } from './icons/RemoveSvgIcon';

interface Agent {
    id: number;
    name: AgentsType;
}


function generateOptions() {
    const agents = Object.values(AgentsType);
    return agents.map((agent, index) => {
        return {
            name: agent,
            id: index
        }
    })

}
const agents: Agent[] = generateOptions()

const ApiKeysConfigComponent: React.FC = () => {
    const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
    const [apiKey, setApiKey] = useState<string>('');
    const [apiKeys, setApiKeys] = useState<AiAgentApiKeys>([]);

    // 还原设定值
    useEffect(() => {
        agentsStorage.getValue().then((value) => {
            if (value) {
                setApiKeys(value);
            }
        });
    }, []);

    // 防抖
    const timer = useRef<any>();
    useEffect(() => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
            agentsStorage.setValue(apiKeys).then(() => {
                console.log('apiKeys', apiKeys);
                browser.runtime.sendMessage({ from: 'popup', type: "agents-changed" });
            });
        }, 500)

    }, [apiKeys]);






    const handleAddApiKey = () => {
        if (selectedAgent !== null && apiKey.trim() !== '') {
            const agent = agents.find(m => m.id === selectedAgent);
            if (agent && !apiKeys.some(item => item.agentName === agent.name)) {
                setApiKeys([...apiKeys, { agentName: agent.name, apiKey }]);
                setSelectedAgent(null);
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
            <HeadlingTitle >API 管理</HeadlingTitle>
            <Subtitle>选择 API 提供方，可进行拖拽排序，将优先使用最前的提供方</Subtitle>
            <p className={styles.operation}>
                <select onChange={e => setSelectedAgent(Number(e.target.value))} value={selectedAgent || ''}>
                    <option value="" disabled>选择API提供方</option>
                    {agents.map(agent => (
                        <option key={agent.id} value={agent.id} disabled={apiKeys.some(item => item.agentName === agent.name)}>
                            {agent.name}
                        </option>
                    ))}
                </select>
                <input
                    className={styles.input}
                    type="text"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="输入 API key"
                    disabled={selectedAgent === null}
                />
                <button className={styles.button} onClick={handleAddApiKey} disabled={selectedAgent === null || apiKey.trim() === ''}>
                    添加
                </button>
            </p>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef} className={styles.list}>
                            {apiKeys.map((item, index) => (
                                <Draggable key={item.agentName} draggableId={item.agentName} index={index}>
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
                                                <DragSvgIcon className={styles.dragBtn} style={{ fontSize: '24px' }} /> {/* 拖拽图标 */}
                                            </span>
                                            <label>{item.agentName}</label>
                                            <input
                                                className={styles.input}
                                                type="text"
                                                value={item.apiKey}
                                                onChange={e => handleInputChange(index, e.target.value)}
                                                placeholder="Enter API key"
                                            />
                                            <button className={styles.removeButton} onClick={() => handleRemoveApiKey(index)}>
                                                <RemoveSvgIcon style={{ fontSize: '16px' }} />
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
