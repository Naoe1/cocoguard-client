import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';

function Controls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const panBounds = useMemo(
    () => ({
      minX: -9.5,
      maxX: 9.5,
      minZ: -9.5,
      maxZ: 9.5,
      minY: 0.2,
      maxY: 6,
    }),
    [],
  );

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.5;
    controls.enablePan = true;
    controls.minDistance = 5;
    controls.maxDistance = 40;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2.1;
    controlsRef.current = controls;
    return () => controls.dispose();
  }, [camera, gl]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    // Apply damping and user input
    controls.update();

    // Clamp panning by restricting the controls.target to bounds
    const target = controls.target;
    const cam = camera;
    // Maintain the camera's relative offset from the target
    const offsetX = cam.position.x - target.x;
    const offsetY = cam.position.y - target.y;
    const offsetZ = cam.position.z - target.z;

    const clampedX = THREE.MathUtils.clamp(
      target.x,
      panBounds.minX,
      panBounds.maxX,
    );
    const clampedY = THREE.MathUtils.clamp(
      target.y,
      panBounds.minY,
      panBounds.maxY,
    );
    const clampedZ = THREE.MathUtils.clamp(
      target.z,
      panBounds.minZ,
      panBounds.maxZ,
    );

    if (
      clampedX !== target.x ||
      clampedY !== target.y ||
      clampedZ !== target.z
    ) {
      target.set(clampedX, clampedY, clampedZ);
      cam.position.set(
        target.x + offsetX,
        target.y + offsetY,
        target.z + offsetZ,
      );
    }
  });
  return null;
}
// ...existing code...

// Generate rolling hills
function generateHeight(x, z) {
  return (
    Math.sin(x * 0.5) * 0.3 +
    Math.cos(z * 0.5) * 0.3 +
    Math.sin((x + z) * 0.3) * 0.2
  );
}

function Popup({ tree, onClose, onRemove }) {
  if (!tree) return null;
  const { index, position, coconut } = tree;
  const info = coconut
    ? {
        nickname: coconut.tree_code ?? '—',
        title: coconut.tree_seq ?? coconut.tree_code ?? `Tree #${index}`,
        status: coconut.status ?? '—',
        plantingDate: coconut.planting_date
          ? new Date(coconut.planting_date).toISOString().split('T')[0]
          : '—',
        lastHarvestDate:
          Array.isArray(coconut.harvest) && coconut.harvest[0]?.harvest_date
            ? new Date(coconut.harvest[0].harvest_date)
                .toISOString()
                .split('T')[0]
            : '—',
        lastHarvestWeight:
          Array.isArray(coconut.harvest) &&
          coconut.harvest[0]?.total_weight != null
            ? coconut.harvest[0].total_weight
            : '—',
      }
    : {
        nickname: '—',
        title: `Tree #${index}`,
        status: 'Good',
        plantingDate: '—',
        lastHarvestDate: '—',
        lastHarvestWeight: '—',
      };
  return (
    <div
      className="pointer-events-none absolute inset-0 grid place-items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="pointer-events-auto w-full max-w-sm rounded-lg border bg-card p-4 text-card-foreground shadow-xl md:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-blue-600 hover:text-blue-800">
            <Link to={`/app/coconuts/${tree.coconut.id}`}>{info.title}</Link>
          </h3>
          <button
            onClick={onClose}
            title="Close"
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ✕
          </button>
        </div>
        <div className="mt-2 text-sm leading-6">
          <div>
            <span className="font-semibold">Nickname:</span> {info.nickname}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {info.status}
          </div>
          <div>
            <span className="font-semibold">Planted:</span> {info.plantingDate}
          </div>
          <div>
            <span className="font-semibold">Last harvest:</span>{' '}
            {info.lastHarvestDate}
          </div>
          <div>
            <span className="font-semibold">Last harvest (kg):</span>{' '}
            {info.lastHarvestWeight}
          </div>
          <div>
            <span className="font-semibold">Coords:</span>{' '}
            {position.map((n) => n.toFixed(2)).join(', ')}
          </div>
        </div>
        {onRemove && (
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => {
                onRemove(index);
                onClose?.();
              }}
              variant="destructive"
            >
              Remove tree
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Tree({ position, index, coconut, onSelect, onHover }) {
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

  return (
    <group
      position={position}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 1.2, 8]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <coneGeometry args={[0.55, 0.9, 10]} />
        <meshStandardMaterial
          color={hovered ? '#38a169' : '#2f855a'}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <coneGeometry args={[0.45, 0.75, 10]} />
        <meshStandardMaterial
          color={hovered ? '#48bb78' : '#2f855a'}
          roughness={0.8}
        />
      </mesh>
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

export default function Farm3D({ layout, onRemove }) {
  const [selectedTree, setSelectedTree] = useState(null);
  const [hovering, setHovering] = useState(false);

  const trees = useMemo(() => {
    if (Array.isArray(layout)) {
      return layout.map(({ x, z, coconut }) => ({
        pos: [x, generateHeight(x, z), z],
        coconut,
      }));
    }
    return [];
  }, [layout]);

  const closePopup = useCallback(() => setSelectedTree(null), []);
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
          />
        ))}
        <Controls />
      </Canvas>
      <Popup tree={selectedTree} onClose={closePopup} onRemove={onRemove} />
    </div>
  );
}
