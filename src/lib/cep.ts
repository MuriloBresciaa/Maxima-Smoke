/* ─── CEP Address Resolution — ViaCEP API ─── */

export interface AddressData {
  cep: string;
  logradouro: string;   // Street
  complemento: string;  // Complement
  bairro: string;       // Neighborhood
  localidade: string;   // City
  uf: string;           // State (UF)
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface CepResult {
  data: AddressData | null;
  error: string | null;
}

/**
 * Fetches address data from the ViaCEP public API.
 * @param cep - The CEP string (with or without dash, e.g. "13015-001" or "13015001")
 * @returns A CepResult object with either data or an error message.
 */
export async function fetchAddressByCep(cep: string): Promise<CepResult> {
  // Strip all non-digit characters
  const sanitized = cep.replace(/\D/g, "");

  if (sanitized.length !== 8) {
    return { data: null, error: "CEP deve conter 8 dígitos." };
  }

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${sanitized}/json/`,
      { signal: AbortSignal.timeout(8000) }
    );

    if (!response.ok) {
      return {
        data: null,
        error: `Erro ao consultar CEP (HTTP ${response.status}).`,
      };
    }

    const json = await response.json();

    // ViaCEP returns { erro: true } for invalid CEPs
    if (json.erro) {
      return { data: null, error: "CEP não encontrado. Verifique e tente novamente." };
    }

    return { data: json as AddressData, error: null };
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return { data: null, error: "Tempo limite esgotado. Verifique sua conexão." };
    }
    return { data: null, error: "Falha ao buscar endereço. Tente novamente." };
  }
}
