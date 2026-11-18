import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Clerk webhook endpoint.
 *
 * Listens for the `user.created` event and automatically assigns
 * the "commercial" role to any new user that doesn't already have a role
 * (e.g. admin or manager accounts created via the API with a pre-set role).
 *
 * Configure this URL in Clerk Dashboard → Webhooks → Add Endpoint:
 *   https://<your-domain>/api/clerk-webhook
 * Subscribe to: user.created
 *
 * Set CLERK_WEBHOOK_SECRET in .env.local (from Clerk Dashboard webhook signing secret).
 */

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // ── Verify the Svix signature ──
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const payload = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: any;

  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // ── Handle user.created ──
  if (event.type === "user.created") {
    const user = event.data;
    const existingRole = user?.public_metadata?.role;

    // Only assign "commercial" if no role was pre-set (e.g. via API)
    if (!existingRole) {
      try {
        const client = await clerkClient();
        await client.users.updateUser(user.id, {
          publicMetadata: { role: "commercial" },
        });
      } catch (err) {
        return NextResponse.json(
          { error: "Failed to assign role" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ success: true });
}
