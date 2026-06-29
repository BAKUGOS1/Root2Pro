import { z } from 'zod';

export const nodeSchema = z.object({
  id: z.string().min(3),
  track: z.string().min(2),
  type: z.enum(['topic', 'practice', 'project', 'quiz', 'recall']),
  title: z.string().min(2),
  level: z.string().optional(),
  status: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  contentRef: z.string().min(1),
  estimatedMinutes: z.number().optional(),
  tags: z.array(z.string()).default([])
});

export const edgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  type: z.enum(['prerequisite', 'recommended-next', 'suggested-before', 'related', 'project-requires', 'question-tests'])
});

export const curriculumGraphSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(2),
  version: z.string().min(1),
  description: z.string().optional(),
  entryNodeIds: z.array(z.string()).default([]),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema)
});
