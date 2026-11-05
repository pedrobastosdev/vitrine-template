'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { salvarNegocio } from '@/lib/acoes/negocio';
import { contraste, corDoTexto } from '@/lib/cor';
import { negocioSchema, type NegocioForm } from '@/lib/schemas';
import { cn } from '@/lib/utils';

type Campo = keyof NegocioForm;

function Secao({ titulo, descricao, children }: { titulo: string; descricao?: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">{titulo}</CardTitle>
        {descricao && <CardDescription>{descricao}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function SeletorCor({ id, valor, onChange, rotulo }: { id: string; valor: string; onChange: (v: string) => void; rotulo: string }) {
  const valida = /^#[0-9a-fA-F]{6}$/.test(valor);
  const texto = valida ? corDoTexto(valor) : '#000000';
  const razao = valida ? contraste(valor, texto) : 0;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{rotulo}</Label>
      <div className="flex gap-2">
        <input type="color" value={valida ? valor : '#000000'} onChange={(e) => onChange(e.target.value)} aria-label={`${rotulo}: seletor`} className="h-10 w-14 cursor-pointer rounded-lg border bg-background p-1" />
        <Input id={id} value={valor} onChange={(e) => onChange(e.target.value)} className="h-10 font-mono uppercase" maxLength={7} />
      </div>
      {valida && (
        <div className="flex items-center gap-2 rounded-lg p-2.5 text-sm font-semibold" style={{ background: valor, color: texto }}>
          Texto de exemplo
          <span className="ml-auto rounded bg-black/15 px-1.5 py-0.5 text-xs">contraste {razao.toFixed(1)}:1</span>
        </div>
      )}
    </div>
  );
}

export function FormNegocio({ valores, uploads }: { valores: NegocioForm; uploads: ReactNode }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<NegocioForm>({ resolver: zodResolver(negocioSchema), defaultValues: valores });
  const [primaria, secundaria, estilo] = useWatch({ control, name: ['corPrimaria', 'corSecundaria', 'estiloTitulo'] });

  const salvar = async (dados: NegocioForm) => {
    const r = await salvarNegocio(dados);
    if (!r.ok) return void toast.error(r.erro);
    toast.success('Configurações salvas. O site já foi atualizado.');
    reset(dados);
    router.refresh();
  };

  const campo = (nome: Campo, rotulo: string, props: React.ComponentProps<'input'> & { largo?: boolean; ajuda?: string } = {}) => {
    const { largo, ajuda, ...resto } = props;
    return (
      <div className={cn('space-y-2', largo && 'sm:col-span-2')}>
        <Label htmlFor={nome}>{rotulo}</Label>
        <Input id={nome} className="h-10" aria-invalid={!!errors[nome]} {...resto} {...register(nome)} />
        {ajuda && !errors[nome] && <p className="text-xs text-muted-foreground">{ajuda}</p>}
        {errors[nome] && <p className="text-sm text-destructive">{errors[nome]?.message}</p>}
      </div>
    );
  };
  const area = (nome: Campo, rotulo: string) => (
    <div className="space-y-2 sm:col-span-2">
      <Label htmlFor={nome}>{rotulo}</Label>
      <Textarea id={nome} rows={4} aria-invalid={!!errors[nome]} {...register(nome)} />
      {errors[nome] && <p className="text-sm text-destructive">{errors[nome]?.message}</p>}
    </div>
  );

  const corOk = /^#[0-9a-fA-F]{6}$/.test(primaria) && /^#[0-9a-fA-F]{6}$/.test(secundaria);

  return (
    <form onSubmit={handleSubmit(salvar)} noValidate className="space-y-6 pb-24 lg:pb-0">
      <Secao titulo="Identidade" descricao="Nome e imagens que aparecem no site.">
        {campo('nome', 'Nome do negócio')}
        {campo('rotuloItens', 'Como chamar o catálogo', { ajuda: 'Ex.: Imóveis, Serviços, Produtos' })}
        {campo('slogan', 'Slogan', { largo: true })}
        <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">{uploads}</div>
      </Secao>

      <Secao titulo="Cores e estilo" descricao="O texto sobre cada cor é escolhido automaticamente para manter a leitura fácil.">
        <Controller control={control} name="corPrimaria" render={({ field }) => <SeletorCor id="corPrimaria" rotulo="Cor principal" valor={field.value} onChange={field.onChange} />} />
        <Controller control={control} name="corSecundaria" render={({ field }) => <SeletorCor id="corSecundaria" rotulo="Cor de destaque" valor={field.value} onChange={field.onChange} />} />
        {(errors.corPrimaria || errors.corSecundaria) && <p className="text-sm text-destructive sm:col-span-2">{errors.corPrimaria?.message ?? errors.corSecundaria?.message}</p>}
        <fieldset className="space-y-2 sm:col-span-2">
          <legend className="mb-2 text-sm font-medium">Estilo dos títulos</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ['sans', 'Moderno', 'var(--font-titulo-sans)'],
              ['serifa', 'Elegante', 'var(--font-titulo-serifa)'],
            ] as const).map(([valor, rotulo, fonte]) => (
              <label key={valor} className={cn('cursor-pointer rounded-xl border p-4 transition has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/30', estilo === valor && 'bg-muted/50')}>
                <input type="radio" value={valor} className="sr-only" {...register('estiloTitulo')} />
                <span className="block text-2xl font-bold" style={{ fontFamily: fonte }}>Aa Título</span>
                <span className="text-sm text-muted-foreground">{rotulo}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {corOk && (
          <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10 sm:col-span-2" aria-hidden>
            <div className="p-5" style={{ background: primaria, color: corDoTexto(primaria) }}>
              <p className="text-xl font-bold" style={{ fontFamily: estilo === 'serifa' ? 'var(--font-titulo-serifa)' : 'var(--font-titulo-sans)' }}>
                Prévia do seu site
              </p>
              <p className="text-sm opacity-90">Assim ficam as faixas e botões com a cor principal.</p>
              <span className="mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold" style={{ background: secundaria, color: corDoTexto(secundaria) }}>
                Botão de destaque
              </span>
            </div>
          </div>
        )}
      </Secao>

      <Secao titulo="Contato" descricao="Usado no botão de WhatsApp, no rodapé e na página de contato.">
        {campo('whatsapp', 'WhatsApp', { inputMode: 'tel', placeholder: '5548999990000', ajuda: 'Com DDI 55 e DDD, só números' })}
        {campo('telefone', 'Telefone fixo', { inputMode: 'tel' })}
        {campo('email', 'E-mail', { type: 'email' })}
        {campo('instagram', 'Instagram', { placeholder: 'seuusuario' })}
        {campo('endereco', 'Endereço', { largo: true })}
        {campo('cidade', 'Cidade - UF')}
      </Secao>

      <Secao titulo="Página inicial" descricao="Textos do topo da home e da seção Sobre.">
        {campo('heroTitulo', 'Título principal', { largo: true })}
        {area('heroSubtitulo', 'Subtítulo')}
        {campo('sobreTitulo', 'Título da seção Sobre', { largo: true })}
        {area('sobreTexto', 'Texto da seção Sobre')}
      </Secao>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/95 p-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0">
        <Button type="submit" size="lg" disabled={isSubmitting || !isDirty} className="h-11 w-full text-base lg:w-auto lg:px-8">
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Save />}
          {isSubmitting ? 'Salvando...' : 'Salvar configurações'}
        </Button>
      </div>
    </form>
  );
}
