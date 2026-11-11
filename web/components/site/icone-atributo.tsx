import { createElement } from 'react';
import {
  Bath,
  BedDouble,
  Car,
  CircleCheck,
  Clock,
  MapPin,
  MapPinned,
  Ruler,
  Tag,
  Timer,
  Truck,
  Weight,
  type LucideIcon,
} from 'lucide-react';

/** Ícone por palavra-chave do nome do atributo. Atributos são livres, então há um padrão. */
const REGRAS: [RegExp, LucideIcon][] = [
  [/quarto|dormit|suíte|suite/i, BedDouble],
  [/banheiro|lavabo/i, Bath],
  [/vaga|garagem/i, Car],
  [/área de atendimento|região|cobertura|rodovia/i, MapPinned],
  [/área|metragem|m²|tamanho/i, Ruler],
  // Antes da regra de local: "capacidade" contém "cidade"
  [/capacidade|peso|tonelada/i, Weight],
  [/bairro|local|\bcidade|endereço/i, MapPin],
  [/chegada|prazo|tempo/i, Timer],
  [/atendimento|horário|hora/i, Clock],
  [/frota|veículo|caminh/i, Truck],
  [/preço|valor|taxa/i, Tag],
];

export function iconeDoAtributo(nome: string): LucideIcon {
  return REGRAS.find(([re]) => re.test(nome))?.[1] ?? CircleCheck;
}

export function IconeAtributo({ nome, className }: { nome: string; className?: string }) {
  return createElement(iconeDoAtributo(nome), { className, 'aria-hidden': true });
}
