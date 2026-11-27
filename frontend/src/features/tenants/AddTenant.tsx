import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '../../shared/apiClient';
import  { createTenant, type CreateTenantRequest } from './TenantApi';

const addRenterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Namn måste anges')
      .max(100, 'Namnet får vara högst 100 tecken'),
    email: z
      .string()
      .trim()
      .min(1, 'E-post är obligatoriskt')
      .email('Ange en giltig e-postadress'),
    password: z.string().min(8, 'Lösenordet måste vara minst 8 tecken'),
    confirmPassword: z.string().min(1, 'Bekräfta lösenordet'),
    // Select values are strings, so the schema stays string-based
    apartmentId: z.string().min(1, 'Välj en lägenhet'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Lösenorden matchar inte',
    path: ['confirmPassword'],
  });

type AddRenterFormData = z.infer<typeof addRenterSchema>;

function mapTenantError(error: unknown): string {
  if (error instanceof ApiError && error.status === 409) {
    return error.message.toLowerCase().includes('lägenhet')
      ? 'Lägenheten har redan en hyresgäst'
      : 'E-postadressen används redan';
  }
  return 'Ett fel uppstod. Försök igen.';
}

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`;

// when apartments are added, retrieve and sort here

export const AddRenter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddRenterFormData>({
    resolver: zodResolver(addRenterSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: CreateTenantRequest) => createTenant(values),
    onSuccess: () => reset(),
  });

  const isLoading = mutation.isPending;
  const successMessage = mutation.isSuccess
    ? `Hyresgästen ${mutation.data.name} har lagts till!`
    : '';
  const errorMessage = mutation.isError ? mapTenantError(mutation.error) : '';

  const onSubmit = (data: AddRenterFormData) => {
    mutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      apartmentId: Number(data.apartmentId),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lägg till hyresgäst</h1>
        <p className="text-gray-600 text-sm mb-6">Fyll i uppgifterna nedan</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Namn
            </label>
            <input
              id="name"
              type="text"
              placeholder="Hyresgästens namn"
              {...register('name')}
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-post
            </label>
            <input
              id="email"
              type="email"
              placeholder="hyresgast@exempel.se"
              {...register('email')}
              className={inputClass(!!errors.email)}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              placeholder="Minst 8 tecken"
              {...register('password')}
              className={inputClass(!!errors.password)}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Repetera lösenord
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repetera lösenordet"
              {...register('confirmPassword')}
              className={inputClass(!!errors.confirmPassword)}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Apartment Select */}
          <div>
            <label htmlFor="apartmentId" className="block text-sm font-medium text-gray-700 mb-1">
              Lägenhet
            </label>
            <select
              id="apartmentId"
              {...register('apartmentId')}
              className={inputClass(!!errors.apartmentId)}
            >
              <option value="">Välj lägenhet</option>
              {/*apartments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.number} {apt.floor}
                </option>
              ))*/}
            </select>
            {errors.apartmentId && (
              <span className="text-red-500 text-xs mt-1">{errors.apartmentId.message}</span>
            )}
          </div>

          {successMessage && (
            <p className="text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-2 text-sm">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-red-700 bg-red-50 border border-red-200 rounded-md px-4 py-2 text-sm">
              {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            {isLoading ? 'Sparar...' : 'Lägg till hyresgäst'}
          </button>
        </form>
      </div>
    </div>
  );
};
