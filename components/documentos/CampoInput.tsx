'use client'
import type { UseFormRegister, FieldError, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import type { CampoFormulario } from '@/types'
import { cn } from '@/lib/utils'

interface CampoInputProps {
  campo: CampoFormulario
  register: UseFormRegister<any>
  error?: FieldError
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
}

export function CampoInput({ campo, register, error, setValue, watch }: CampoInputProps) {
  const inputBase = cn(
    'w-full px-3 py-2 text-sm bg-white border rounded-lg placeholder-slate-400',
    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all',
    error ? 'border-red-300 bg-red-50' : 'border-slate-200'
  )

  const labelEl = (
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {campo.label}
      {campo.obligatorio && <span className="text-red-500 ml-1">*</span>}
    </label>
  )

  const errorEl = error && (
    <p className="text-xs text-red-600 mt-1">{error.message}</p>
  )

  const ayudaEl = campo.ayuda && !error && (
    <p className="text-xs text-slate-400 mt-1">{campo.ayuda}</p>
  )

  // SELECT
  if (campo.tipo === 'select') {
    return (
      <div>
        {labelEl}
        <select {...register(campo.id)} className={inputBase}>
          <option value="">— Selecciona —</option>
          {campo.opciones?.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
        {errorEl}
        {ayudaEl}
      </div>
    )
  }

  // TEXTAREA
  if (campo.tipo === 'textarea') {
    return (
      <div>
        {labelEl}
        <textarea
          {...register(campo.id)}
          rows={3}
          placeholder={campo.placeholder}
          className={cn(inputBase, 'resize-none')}
        />
        {errorEl}
        {ayudaEl}
      </div>
    )
  }

  // CURRENCY con prefijo €
  if (campo.tipo === 'currency') {
    return (
      <div>
        {labelEl}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium select-none">€</span>
          <input
            {...register(campo.id)}
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            className={cn(inputBase, 'pl-7')}
          />
        </div>
        {errorEl}
        {ayudaEl}
      </div>
    )
  }

  // PERCENTAGE
  if (campo.tipo === 'percentage') {
    return (
      <div>
        {labelEl}
        <div className="relative">
          <input
            {...register(campo.id)}
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="0"
            className={cn(inputBase, 'pr-7')}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium select-none">%</span>
        </div>
        {errorEl}
        {ayudaEl}
      </div>
    )
  }

  // DATE
  if (campo.tipo === 'date') {
    return (
      <div>
        {labelEl}
        <input
          {...register(campo.id)}
          type="date"
          className={inputBase}
        />
        {errorEl}
        {ayudaEl}
      </div>
    )
  }

  // PHONE
  if (campo.tipo === 'phone') {
    return (
      <div>
        {labelEl}
        <input
          {...register(campo.id)}
          type="tel"
          placeholder={campo.placeholder ?? '600 000 000'}
          className={inputBase}
        />
        {errorEl}
        {ayudaEl}
      </div>
    )
  }

  // EMAIL
  if (campo.tipo === 'email') {
    return (
      <div>
        {labelEl}
        <input
          {...register(campo.id)}
          type="email"
          placeholder={campo.placeholder ?? 'correo@ejemplo.com'}
          className={inputBase}
        />
        {errorEl}
        {ayudaEl}
      </div>
    )
  }

  // NUMBER
  if (campo.tipo === 'number') {
    return (
      <div>
        {labelEl}
        <div className={campo.sufijo ? 'relative' : ''}>
          <input
            {...register(campo.id)}
            type="number"
            step="1"
            min="0"
            placeholder={campo.placeholder ?? '0'}
            className={cn(inputBase, campo.sufijo ? 'pr-10' : '')}
          />
          {campo.sufijo && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 select-none">
              {campo.sufijo}
            </span>
          )}
        </div>
        {errorEl}
        {ayudaEl}
      </div>
    )
  }

  // NIF / TEXT por defecto
  return (
    <div>
      {labelEl}
      <input
        {...register(campo.id)}
        type="text"
        placeholder={campo.placeholder ?? (campo.tipo === 'nif' ? '12345678A' : '')}
        className={cn(inputBase, campo.tipo === 'nif' ? 'uppercase' : '')}
        style={campo.tipo === 'nif' ? { textTransform: 'uppercase' } : undefined}
      />
      {errorEl}
      {ayudaEl}
    </div>
  )
}
