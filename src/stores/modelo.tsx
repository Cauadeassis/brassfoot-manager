import { create } from "zustand";

interface Loja {
  dinheiro: number;
  definirDinheiroFixo: () => void;
  aumentar500reais: () => void;
}

const usarLoja = create<Loja>()((set) => ({
  dinheiro: 1000,
  definirDinheiroFixo: () => set({ dinheiro: 5000 }),
  aumentar500reais: () => set((loja) => ({ dinheiro: loja.dinheiro + 500 })),
}));

export default function Contador() {
  const dinheiro = usarLoja((loja) => loja.dinheiro);
  const definirDinheiroFixo = usarLoja((loja) => loja.definirDinheiroFixo);
  const aumentar500reais = usarLoja((loja) => loja.aumentar500reais);

  return (
    <div>
      <h3>Gerenciador de Finanças</h3>
      <p>Saldo:R${dinheiro}</p>
      <button onClick={definirDinheiroFixo}>
        Definir dinheiro fixo (R$ 5000)
      </button>
      <button onClick={aumentar500reais}>Aumentar R$ 500</button>
    </div>
  );
}
