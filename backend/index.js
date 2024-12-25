import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.BACK_PORT || 3001;

const jsonParser = bodyParser.json();

const apiKey = process.env.VERIFF_KEY;
const baseUrl = process.env.BASE_VERIFF_URL;

const gqlUrl = process.env.VITE_GRAPHQL_URI;
let gqlApiKey = "";

console.log(apiKey, baseUrl, gqlUrl);

const updateKYCStatus = async (id, stat) => {
  try {
    const response = await fetch(`${gqlUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${gqlApiKey}`,
      },
      body: JSON.stringify({
        query: 'mutation UpdateInvestorKyc($kycData: InvestorKycInput!) {\n  updateInvestorKyc(kycData: $kycData)\n}',
        variables: {
          kycData: { investorID: parseInt(id,10), status: stat, isKyc: stat === 1 || stat === 3, kycApplied: stat === 7 },
        },
      }),
    });
    if (response.ok) {
      //
    } else {
      console.error('Failed to update KYC');
    }
  } catch (error) {
    console.error(error);
  }
};

// Get GQL API KEY
app.post('/api/get-gql-key', jsonParser, async (req, res) => {
  gqlApiKey = req.body.key;
  res.json({ message: 'Successfully retrieved GQL API Key' });
});

// Create a Veriff session
app.post('/api/create-session', jsonParser, async (req, res) => {
  const investor = req.body;
  try {
    const response = await fetch(`${baseUrl}/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': apiKey,
      },
      body: JSON.stringify({
        verification: {
          person: {
            firstName: investor.firstName,
            lastName: investor.lastName,
            idNumber: investor.ID.toString(),
          },
          vendorData: investor?.ID.toString(),
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      res.json({
        sessionHost: data.verification.host,
        sessionToken: data.verification.sessionToken,
      });
    } else {
      res.status(500).json({ error: 'Failed to create Veriff session' });
      throw new Error('Failed to create Veriff session');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create Veriff session' });
  }
});

// Hook for Events
app.post('/api/hook', jsonParser, async (req, res) => {
  const { code, vendorData } = req.body;

  if (code === 7001) {
    // Verification started
  } else if (code === 7002) {
    // Verification submitted
    updateKYCStatus(vendorData, 7);
  } else if (code === 7007) {
    // waiting complete
  } else if (code === 7008) {
    // waiting_continued
  } else if (code === 7009) {
    // flow_finished
  } else if (code === 7010) {
    // flow_canceled
  }
});

// Hook for Decisions
app.post('/api/notification', jsonParser, async (req, res) => {
  const { verification } = req.body;

  const { code } = verification.code;
  if (code === 9001) {
    // User is approved
    updateKYCStatus(verification.vendorData, 1);
  } else if (code === 9102) {
    // User is rejected
  } else if (code === 9103) {
    // resubmission
  } else if (code === 9104) {
    // expired/abandoned
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
