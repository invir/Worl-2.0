"use server";

import { VerificationLevel } from "@worldcoin/idkit-core";
import { verifyCloudProof } from "@worldcoin/idkit-core/backend";

export type VerifyReply = {
  success: boolean;
  code?: string;
  attribute?: string | null;
  detail?: string;
};

interface IVerifyRequest {
  proof: {
    nullifier_hash: string;
    merkle_root: string;
    proof: string;
    verification_level: VerificationLevel;
  };
  signal?: string;
}

const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
const action = process.env.NEXT_PUBLIC_WLD_ACTION as string;

export async function verify(
  proof: IVerifyRequest["proof"],
  signal?: string
): Promise<VerifyReply> {
  const verifyRes = await verifyCloudProof(proof, app_id, action, signal);
  if (verifyRes.success) {
    return { success: true };
  } else {
    return { success: false, code: verifyRes.code, attribute: verifyRes.attribute, detail: verifyRes.detail };
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyProof } from 'some-proof-library'; // Import the library you're using to verify the proof

// Your backend action handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Extract the proof from the request body
        const { proof, data } = req.body;

        // Verify the proof
        const isValidProof = await verifyProof(proof, data); // Use your verification method here

        if (!isValidProof) {
            return res.status(400).json({ message: 'Invalid proof' });
        }

        // Perform any backend actions needed after proof verification
        // Example: Update user status in the database
        // await updateUserStatus(data.userId, { verified: true });

        // Example: Issue a token or perform some other action
        // const token = await issueToken(data.userId);

        // Return a success response
        return res.status(200).json({ message: 'Proof verified successfully', data: /* token or other data */ });

    } catch (error) {
        console.error('Error verifying proof:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
