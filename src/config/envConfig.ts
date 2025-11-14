interface EnvConfig {
  databaseUrlCentral: string;
  databaseUrlBranchBondowoso: string;
  nodeEnv: string;
}

function validateEnvConfig(): EnvConfig {
  const databaseUrlCentral = process.env.DATABASE_URL_CENTRAL;
  const databaseUrlBranchBondowoso = process.env.DATABASE_URL_BRANCH_BONDOWOSO;
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (!databaseUrlCentral) {
    throw new Error('DATABASE_URL_CENTRAL environment variable is required');
  }

  if (!databaseUrlBranchBondowoso) {
    throw new Error('DATABASE_URL_BRANCH_BONDOWOSO environment variable is required');
  }

  return {
    databaseUrlCentral,
    databaseUrlBranchBondowoso,
    nodeEnv,
  };
}

export const envConfig = validateEnvConfig();
