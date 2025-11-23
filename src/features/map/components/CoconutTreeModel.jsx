import React, { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
/*
Author: Pixel_Monster (https://sketchfab.com/ar.jethin)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/coconut-tree-low-poly-8c5d6b661b2f4c37834d87cd187eb907
Title: Coconut Tree Low poly
*/
useGLTF.preload('/coconut_3d/scene.gltf');

export default function CoconutTreeModel({
  position = [0, 0, 0],
  hovered = false,
  diseased = false,
}) {
  const { scene } = useGLTF('/coconut_3d/scene.gltf');

  const localScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const healthyColor = hovered ? '#38a169' : '#2f855a';
    const diseasedColor = '#e53e3e';
    const tint = diseased ? diseasedColor : healthyColor;

    localScene.traverse((node) => {
      if (node.isMesh) {
        if (!node.material.isCloned) {
          node.material = node.material.clone();
          node.material.isCloned = true;
        }
        node.material.color.set(tint);
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [hovered, diseased, localScene]);

  return (
    <group position={position} scale={0.021} dispose={null}>
      <primitive object={localScene} />
    </group>
  );
}
