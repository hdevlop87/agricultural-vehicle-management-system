
import { Form } from '@/components/ui/form';
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

const NForm = ({
  schema,
  defaultValues,
  onSubmit,
  className='',
  id,
  children,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form id={id} onSubmit={form.handleSubmit(onSubmit)} className={cn('flex flex-col w-full gap-4',className)} autoComplete="off">
        {children}
      </form>
    </Form>
  );
};

export default NForm;