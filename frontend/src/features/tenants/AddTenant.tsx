import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { insertCall } from './api/TenantApi';


interface tenantProp {
    name: string,
    email: string,
    password: string,
    userRole: string,
}

// Define Zod schema for validation
const addRenterSchema = z.object({ // retrieving from forum
    name: z
    .string()
    .min(1, 'Namn måste anges'),
    email: z
        .string()
        .min(1, 'E-post är obligatoriskt')
        .email('Ange en giltig e-postadress'),
    password: z
        .string()
        .min(8, 'Lösenordet måste vara minst 8 tecken'),
    confirmPassword: z
        .string()
        .min(1, 'Bekräfta lösenordet'),
    apartmentId: z
        .string()
        .min(1, 'Välj en lägenhet'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Lösenorden matchar inte',
    path: ['confirmPassword'],
});

type AddRenterFormData = z.infer<typeof addRenterSchema>;

// when apartments are added, retrieve and sort here

export const AddRenter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddRenterFormData>({
    resolver: zodResolver(addRenterSchema),
  });

  const onSubmit = async (data: AddRenterFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Prepare data for API (exclude confirmPassword)
      const tenantData: tenantProp = {
        name: data.name,
        email: data.email,
        password: data.password,
        userRole: "TENANT",
      };
      const apartmentId = data.apartmentId; // to be used when aoartnebts can be retrieved and sent

      // Call the API
      const response = await insertCall(tenantData);

      // Success
      setSuccessMessage(`Hyresgästen ${response.name} har lagts till!`);
      reset(); // Clear form
      console.log('Created tenant:', response);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Ett fel uppstod'
      );
      console.error('Error creating tenant:', error);
    } finally {
      setIsLoading(false);
    }
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
            className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
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
            className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
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
            className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
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
            className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
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
            {...register('apartmentId', { valueAsNumber: true })}
            className={`w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.apartmentId ? 'border-red-500' : 'border-gray-300'
            }`}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Lägg till hyresgäst
        </button>
      </form>
    </div>
  </div>
);

}