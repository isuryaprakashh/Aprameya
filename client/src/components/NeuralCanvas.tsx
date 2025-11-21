import { useNeuralCanvas } from '@/hooks/useAprameyaAnimations';

const NeuralCanvas = () => {
    const canvasRef = useNeuralCanvas();
    return <canvas ref={canvasRef} id="neural-canvas" />;
};

export default NeuralCanvas;
