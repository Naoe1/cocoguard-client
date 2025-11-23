import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Popup } from './Popup';
import CoconutTreeModel from './CoconutTreeModel';
import { OrbitControls } from '@react-three/drei';

function Controls() {
  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.5}
      enablePan
      minDistance={5}
      maxDistance={40}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.1}
      makeDefault
    />
  );
}

function generateHeight(x, z) {
  return (
    Math.sin(x * 0.5) * 0.3 +
    Math.cos(z * 0.5) * 0.3 +
    Math.sin((x + z) * 0.3) * 0.2
  );
}

function Tree({ position, index, coconut, onSelect, onHover, highlighted }) {
  const [hovered, setHovered] = useState(false);

  const handleOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover?.(true);
  };

  const handleOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    onHover?.(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.({ index, position, coconut });
  };

  const isDiseased = coconut?.status === 'Diseased';

  return (
    <group
      position={position}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      <CoconutTreeModel
        position={[0, 0, 0]}
        hovered={hovered || highlighted}
        diseased={isDiseased}
      />
    </group>
  );
}

function Terrain() {
  const geom = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(20, 20, 64, 64);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const y = generateHeight(x, z);
      pos.setZ(i, y);
    }
    geometry.computeVertexNormals();
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }, []);

  return (
    <mesh geometry={geom} receiveShadow>
      <meshStandardMaterial color="#7fcf8a" roughness={1} metalness={0} />
    </mesh>
  );
}

// Smooth camera focus component
function CameraFocus({ target, onDone }) {
  const { camera, controls } = useThree();
  const [active, setActive] = useState(true);
  const duration = 0.6; // seconds
  const start = useMemo(
    () => ({
      position: camera.position.clone(),
      target: controls?.target ? controls.target.clone() : new THREE.Vector3(),
      time: performance.now(),
    }),
    [camera, controls],
  );

  useFrame(() => {
    if (!active || !target) return;
    const elapsed = (performance.now() - start.time) / 1000;
    const t = Math.min(1, elapsed / duration);
    // Ease (smoothstep)
    const ease = t * t * (3 - 2 * t);
    const targetVec = new THREE.Vector3(...target);
    const camOffset = new THREE.Vector3(4, 3, 4); // offset so we look slightly from above/side
    const desiredPos = targetVec.clone().add(camOffset);
    camera.position.lerpVectors(start.position, desiredPos, ease);
    if (controls?.target) {
      controls.target.lerpVectors(start.target, targetVec, ease);
      controls.update();
    }
    if (t >= 1) {
      setActive(false);
      onDone?.();
    }
  });
  return null;
}

export default function Farm3D({ layout, onRemove }) {
  const [selectedTree, setSelectedTree] = useState(null);
  const [hovering, setHovering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [focusTarget, setFocusTarget] = useState(null);

  const trees = useMemo(() => {
    if (Array.isArray(layout)) {
      return layout.map(({ x, z, coconut }) => ({
        pos: [x, generateHeight(x, z), z],
        coconut,
      }));
    }
    return [];
  }, [layout]);

  const closePopup = useCallback(() => {
    setSelectedTree(null);
    setHighlightIndex(null);
    setFocusTarget(null);
  }, []);

  const performSearch = useCallback(() => {
    if (!searchTerm) return;
    const termLower = searchTerm.trim().toLowerCase();
    const foundIndex = trees.findIndex((t) => {
      const c = t.coconut;
      if (!c) return false;
      const idStr = c.id != null ? String(c.id).toLowerCase() : '';
      const codeStr = c.tree_code ? c.tree_code.toLowerCase() : '';
      const seqStr = c.tree_seq ? String(c.tree_seq).toLowerCase() : '';
      return (
        idStr === termLower ||
        codeStr === termLower ||
        seqStr === termLower ||
        codeStr.includes(termLower) ||
        seqStr.includes(termLower)
      );
    });
    if (foundIndex >= 0) {
      const treeData = {
        index: foundIndex,
        position: trees[foundIndex].pos,
        coconut: trees[foundIndex].coconut,
      };
      setSelectedTree(treeData);
      setHighlightIndex(foundIndex);
      setFocusTarget(trees[foundIndex].pos);
    } else {
      // Optional: could show a toast; for now just clear highlight
      setHighlightIndex(null);
    }
  }, [searchTerm, trees]);

  const handleSearchKey = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSelectedTree(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      className={`relative h-[80vh] overflow-hidden ${
        hovering ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="absolute left-2 top-2 z-10 flex gap-2 rounded-md bg-white/80 p-2 shadow">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKey}
          placeholder="Search tree id or nickname"
          className="w-48 rounded border px-2 py-1 text-sm focus:outline-none focus:ring"
        />
        <button
          onClick={performSearch}
          className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-500"
        >
          Go
        </button>
        {highlightIndex != null && (
          <button
            onClick={closePopup}
            title="Clear"
            className="rounded bg-gray-300 px-3 py-1 text-sm hover:bg-gray-200"
          >
            Clear
          </button>
        )}
      </div>
      <Canvas
        camera={{ position: [10, 7, 10], fov: 50 }}
        shadows
        dpr={[1, 2]}
        onCreated={({ scene, gl }) => {
          gl.setClearColor('#b7e3ff', 1);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <ambientLight intensity={0.35} />
        <hemisphereLight args={['#ffffff', '#88cc88', 0.5]} />

        <directionalLight
          position={[6, 12, 6]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <Terrain />
        {trees.map((t, i) => (
          <Tree
            key={i}
            index={i}
            position={t.pos}
            coconut={t.coconut}
            onSelect={setSelectedTree}
            onHover={setHovering}
            highlighted={i === highlightIndex}
          />
        ))}
        {focusTarget && <CameraFocus target={focusTarget} onDone={() => {}} />}
        <Controls />
      </Canvas>
      <Popup tree={selectedTree} onClose={closePopup} onRemove={onRemove} />
    </div>
  );
}
