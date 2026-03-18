'use server';

import { actionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { orderFormValidator } from '@/validators/order/orderFormValidator';
import { orderValidator } from '@/validators/order/orderValidator';
import { validateWithErrors } from '@/lib/validateWithErrors';

export const submitOrderAction = actionClient
  .inputSchema(orderFormValidator)
  .action(async ({ parsedInput }) => {
    const validated = await validateWithErrors(
      orderValidator,
      parsedInput,
      orderFormValidator
    );

    const result = await prisma.orderSubmission.create({
      data: validated,
    });

    return result;
  });
