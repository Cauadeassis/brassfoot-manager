"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import useGameStore from "../../../stores/useGameStore";
import { formatMoney, parseMoney } from "../../../utils";
import { generateAIContractOffer } from "../../../gameEngine/contracts";
import styles from "./transferProposal.module.css";

const SIGNING_BONUS_RATE = 0.1;
const MIN_MONTHS = 3;
const MAX_MONTHS = 60;

const STEPS = {
  fee: [50_000_000, 10_000_000, 1_000_000],
  salary: [200_000, 50_000, 1_000],
  signingBonus: [5_000_000, 1_000_000, 100_000],
  months: [10, 5, 1],
};

type Sign = 1 | -1;

const isMoney = (value: number) => Number.isSafeInteger(value) && value >= 0;

interface MoneyInputProps {
  id: string;
  value: number;
  decimals?: number;
  onChange: (value: number) => void;
}

function MoneyInput({ id, value, decimals = 1, onChange }: MoneyInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const formatted = formatMoney(value, decimals);
  const shown =
    draft !== null && parseMoney(draft) === value ? draft : formatted;
  return (
    <input
      id={id}
      inputMode="decimal"
      autoComplete="off"
      value={shown}
      onFocus={(event) => {
        setDraft(formatted);
        event.target.select();
      }}
      onChange={(event) => {
        setDraft(event.target.value);
        const parsed = parseMoney(event.target.value);
        if (Number.isFinite(parsed)) onChange(parsed);
      }}
      onBlur={() => setDraft(null)}
    />
  );
}

interface FieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  steps: number[];
  sign: Sign;
  min?: number;
  max?: number;
  decimals?: number;
}

function Field({
  label,
  value,
  onChange,
  steps,
  sign,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  decimals,
}: FieldProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <MoneyInput
        id={id}
        value={value}
        decimals={decimals}
        onChange={onChange}
      />
      <div>
        {steps.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() =>
              onChange(Math.min(max, Math.max(min, value + sign * step)))
            }
          >
            {sign === 1 ? "+" : "−"}
            {formatMoney(step)}
          </button>
        ))}
      </div>
    </div>
  );
}

interface TransferProposalModalProps {
  playerId: string;
  playerName: string;
  sellerTeamId: string | null;
  estimatedValue: number;
  age: number;
  overall: number;
  buyerBudget: number;
  onClose: () => void;
}

export default function TransferProposalModal({
  playerId,
  playerName,
  sellerTeamId,
  estimatedValue,
  age,
  overall,
  buyerBudget,
  onClose,
}: TransferProposalModalProps) {
  const submitTransferProposal = useGameStore(
    (state) => state.submitTransferProposal,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [suggestedOffer] = useState(
    () =>
      generateAIContractOffer({
        age,
        overall,
        value: estimatedValue,
        maxWageCommitment: estimatedValue * 0.25,
        isFreeAgent: sellerTeamId === null,
      }) ?? { durationInMonths: 12, salary: 0, signingBonus: 0 },
  );
  const [transferFee, setTransferFee] = useState(
    sellerTeamId ? estimatedValue : 0,
  );
  const [salary, setSalary] = useState(suggestedOffer.salary);
  const [durationInMonths, setDurationInMonths] = useState(
    suggestedOffer.durationInMonths,
  );
  const [signingBonusOverride, setSigningBonusOverride] = useState<
    number | null
  >(null);
  const [sign, setSign] = useState<Sign>(1);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null,
  );
  const signingBonus =
    signingBonusOverride ??
    (sellerTeamId
      ? Math.round(transferFee * SIGNING_BONUS_RATE)
      : suggestedOffer.signingBonus);
  const upfrontCost = transferFee + signingBonus;
  const isValidOffer =
    isMoney(transferFee) &&
    isMoney(salary) &&
    isMoney(signingBonus) &&
    durationInMonths >= MIN_MONTHS &&
    durationInMonths <= MAX_MONTHS &&
    upfrontCost <= buyerBudget;
  const errorMessage = isValidOffer
    ? submissionMessage
    : upfrontCost > buyerBudget
      ? `Taxa e luvas somam ${formatMoney(upfrontCost)}, acima do seu orçamento de ${formatMoney(buyerBudget)}.`
      : "Confira taxa, salário, luvas e duração do contrato.";
  useEffect(() => {
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidOffer) return;

    const result = submitTransferProposal({
      playerId,
      sellerTeamId,
      transferFee,
      contractOffer: { durationInMonths, salary, signingBonus },
    });
    if (result.status === "accepted") onClose();
    else setSubmissionMessage(result.message);
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-label={`Proposta por ${playerName}`}
      onClose={onClose}
      onMouseDown={(event) => {
        const { left, right, top, bottom } =
          event.currentTarget.getBoundingClientRect();
        const { clientX: x, clientY: y } = event;
        if (x < left || x > right || y < top || y > bottom) onClose();
      }}
    >
      <header>
        <h2>{playerName}</h2>
      </header>

      <form data-sign={sign === 1 ? "add" : "subtract"} onSubmit={handleSubmit}>
        <div>
          {sellerTeamId && (
            <Field
              label="Taxa de transferência"
              value={transferFee}
              onChange={setTransferFee}
              steps={STEPS.fee}
              sign={sign}
            />
          )}
          <Field
            label="Salário mensal"
            value={salary}
            onChange={setSalary}
            steps={STEPS.salary}
            sign={sign}
          />
          <Field
            label="Luvas"
            value={signingBonus}
            onChange={setSigningBonusOverride}
            steps={STEPS.signingBonus}
            sign={sign}
            decimals={2}
          />
          <Field
            label="Duração em meses"
            value={durationInMonths}
            onChange={setDurationInMonths}
            steps={STEPS.months}
            sign={sign}
            min={MIN_MONTHS}
            max={MAX_MONTHS}
          />
        </div>

        <output>
          Compromisso salarial
          <strong>{formatMoney(salary * durationInMonths)}</strong>
        </output>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <footer>
          <button
            type="button"
            aria-pressed={sign === -1}
            onClick={() => setSign((current) => (current === 1 ? -1 : 1))}
          >
            <span>{sign === 1 ? "+" : "−"}</span>
            INVERTER SINAL
          </button>
          <button
            type="submit"
            className="green-button"
            disabled={!isValidOffer}
          >
            ENVIAR
          </button>
        </footer>
      </form>
      <button type="button" aria-label="Fechar proposta" onClick={onClose}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6.75 6.75 17.25 17.25M17.25 6.75 6.75 17.25" />
        </svg>
      </button>
    </dialog>
  );
}
