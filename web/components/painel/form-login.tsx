'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { entrar } from '@/lib/acoes/auth';
import { loginSchema, type LoginForm } from '@/lib/schemas';

export function FormLogin({ destino, expirou }: { destino?: string; expirou?: boolean }) {
  const [erro, setErro] = useState<string | null>(expirou ? 'Sua sessão expirou. Entre de novo.' : null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', senha: '' } });

  const enviar = async (dados: LoginForm) => {
    setErro(null);
    const r = await entrar(dados, destino);
    if (r?.erro) setErro(r.erro);
  };

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-5">
      {erro && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {erro}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" autoComplete="username" className="h-11" aria-invalid={!!errors.email} {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
        <Input id="senha" type="password" autoComplete="current-password" className="h-11" aria-invalid={!!errors.senha} {...register('senha')} />
        {errors.senha && <p className="text-sm text-destructive">{errors.senha.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-11 w-full text-base">
        {isSubmitting ? <LoaderCircle className="animate-spin" /> : <LogIn />}
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
