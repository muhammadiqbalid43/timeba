import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required").trim(),
  description: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((e) => (e === "" ? null : e)),
  color: z.string().min(1, "Project color is required"),
  hourly_rate: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true; // Allow empty
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Hourly rate must be a valid positive number"),
});

export type ProjectSchemaFormValues = z.infer<typeof projectSchema>;

// Helper function to transform form data for your business logic
export const transformProjectData = (data: ProjectSchemaFormValues) => ({
  ...data,
  hourly_rate:
    data.hourly_rate && data.hourly_rate !== ""
      ? parseFloat(data.hourly_rate)
      : null,
});

export type TransformedProjectData = ReturnType<typeof transformProjectData>;
