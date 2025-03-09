import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface NeuralNetworkProps {
  ratings: number;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

export const NeuralNetwork = ({ ratings, complexity }: NeuralNetworkProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Nodes
    const createNode = (x: number, y: number, z: number, color: string) => {
      const geometry = new THREE.SphereGeometry(0.1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      return sphere;
    };

    // Connections
    const createConnection = (start: THREE.Vector3, end: THREE.Vector3, color: string) => {
      const points = [start, end];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color });
      return new THREE.Line(geometry, material);
    };

    // Add nodes based on complexity
    const layers = {
      basic: 2,
      intermediate: 3,
      advanced: 4
    }[complexity];

    const nodeColors = {
      input: '#FF4D8F',
      hidden: '#FF8D4D',
      output: '#4DCCFF'
    };

    // Create network structure
    for (let layer = 0; layer < layers; layer++) {
      const nodesInLayer = layer === 0 ? ratings : 4;
      const xPos = (layer - (layers - 1) / 2) * 2;

      for (let i = 0; i < nodesInLayer; i++) {
        const yPos = (i - (nodesInLayer - 1) / 2) * 0.5;
        const color = layer === 0 ? nodeColors.input : 
                     layer === layers - 1 ? nodeColors.output : 
                     nodeColors.hidden;
        
        const node = createNode(xPos, yPos, 0, color);
        scene.add(node);

        // Add connections to next layer
        if (layer < layers - 1) {
          const nextLayerNodes = layer === layers - 2 ? 4 : nodesInLayer;
          for (let j = 0; j < nextLayerNodes; j++) {
            const nextYPos = (j - (nextLayerNodes - 1) / 2) * 0.5;
            const connection = createConnection(
              new THREE.Vector3(xPos, yPos, 0),
              new THREE.Vector3(xPos + 2, nextYPos, 0),
              '#2A2A2A'
            );
            scene.add(connection);
          }
        }
      }
    }

    // Animation
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // Cleanup
    return () => {
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, [ratings, complexity]);

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-64 bg-gradient-to-b from-background-dark to-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}; 