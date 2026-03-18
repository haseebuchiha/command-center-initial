import { z } from 'zod';
import { returnValidationErrors } from 'next-safe-action';

export async function validateWithErrors<T extends z.ZodSchema>(
  validator: T,
  data: unknown,
  inputSchema: z.ZodSchema
): Promise<z.infer<T>> {
  try {
    return await validator.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, { _errors: string[] }> = {};

      error.issues.forEach((issue) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : '_root';
        if (!fieldErrors[path]) {
          fieldErrors[path] = { _errors: [] };
        }
        fieldErrors[path]._errors.push(issue.message);
      });

      // inputSchema must match the schema used in .inputSchema()
      returnValidationErrors(inputSchema, fieldErrors);
    }
    throw error;
  }
}
