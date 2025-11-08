"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { FurnitureConfig } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Maximize } from 'lucide-react';

interface FurniturePreviewProps {
  config: FurnitureConfig;
}

export function FurniturePreview({ config }: FurniturePreviewProps) {
  const { length, width, height } = config.dimensions;
  const previewRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: -20, y: 30 });

  const maxDim = Math.max(length, width, height, 150);
  const scale = 200 / maxDim;

  const scaledLength = length * scale;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    let isDragging = false;
    let lastPos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      el.style.cursor = 'grabbing';
      lastPos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      el.style.cursor = 'grab';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;

      setRotation(rot => ({
        x: rot.x - dy * 0.5,
        y: rot.y + dx * 0.5,
      }));

      lastPos = { x: e.clientX, y: e.clientY };
    };
    
    const onMouseLeave = () => {
      isDragging = false;
      el.style.cursor = 'grab';
    }

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Visual Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={previewRef}
          className="w-full h-80 flex items-center justify-center bg-muted/50 rounded-lg select-none cursor-grab"
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative transition-transform duration-300 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
            }}
          >
            <div
              className={cn('absolute border', config.material === 'pvc' ? 'bg-primary/20 border-primary/50' : 'bg-secondary border-secondary-foreground/50')}
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                transform: `translateZ(${scaledLength / 2}px)`,
              }}
            />
            <div
              className={cn('absolute border', config.material === 'pvc' ? 'bg-primary/20 border-primary/50' : 'bg-secondary border-secondary-foreground/50')}
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                transform: `rotateX(180deg) translateZ(${scaledLength / 2}px)`,
              }}
            />
            <div
              className={cn('absolute border', config.material === 'pvc' ? 'bg-primary/30 border-primary/60' : 'bg-muted border-muted-foreground/50')}
              style={{
                width: `${scaledLength}px`,
                height: `${scaledHeight}px`,
                right: '50%',
                transform: `rotateY(90deg) translateZ(${scaledWidth / 2}px)`,
                transformOrigin: 'right',
              }}
            />
            <div
              className={cn('absolute border', config.material === 'pvc' ? 'bg-primary/30 border-primary/60' : 'bg-muted border-muted-foreground/50')}
              style={{
                width: `${scaledLength}px`,
                height: `${scaledHeight}px`,
                left: '50%',
                transform: `rotateY(-90deg) translateZ(${scaledWidth / 2}px)`,
                transformOrigin: 'left',
              }}
            />
            <div
              className={cn('absolute border', config.material === 'pvc' ? 'bg-primary/40 border-primary/70' : 'bg-card border-card-foreground/50')}
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledLength}px`,
                bottom: '50%',
                transform: `rotateX(-90deg) translateZ(${scaledHeight / 2}px)`,
                transformOrigin: 'bottom',
              }}
            />
            <div
              className={cn('absolute border', config.material === 'pvc' ? 'bg-primary/40 border-primary/70' : 'bg-card border-card-foreground/50')}
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledLength}px`,
                top: '50%',
                transform: `rotateX(90deg) translateZ(${scaledHeight / 2}px)`,
                transformOrigin: 'top',
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
