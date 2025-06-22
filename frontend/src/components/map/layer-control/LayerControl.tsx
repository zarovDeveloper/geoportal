import { useState } from 'react'
import { Layers, ChevronDown } from 'lucide-react'

import Button from '@/components/ui/button/Button'
import Switch from '@/components/ui/switch/Switch'
import styles from './LayerControl.module.css'

interface Layer {
    id: string
    name: string
    visible: boolean
}

interface LayerControlProps {
    layers: Layer[]
    onLayerToggle: (layerId: string, visible: boolean) => void
}

const LayerControl = ({
    layers,
    onLayerToggle,
}: LayerControlProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <Button
                    variant="secondary"
                    onClick={() => setIsOpen(!isOpen)}
                    className={styles.triggerButton}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers className="h-5 w-5" />
                        <span>Map Layers</span>
                    </div>
                    <ChevronDown
                        className="h-5 w-5"
                        style={{ 
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                        }}
                    />
                </Button>

                <div className={`${styles.content} ${isOpen ? styles.open : ''}`}>
                    {layers.map((layer) => (
                        <div key={layer.id} className={styles.layerItem}>
                            <div className={styles.layerHeader}>
                                <span className={styles.layerLabel}>{layer.name}</span>
                                <Switch
                                    checked={layer.visible}
                                    onChange={(e) => onLayerToggle(layer.id, e.target.checked)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LayerControl 