import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

// Clerk webhook endpoint for user sync
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET is not set");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    // Get the Svix headers for verification
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    // Get the body
    const body = await request.text();

    // Verify the webhook signature
    const wh = new Webhook(webhookSecret);
    let evt: ClerkWebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkWebhookEvent;
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    // Handle the webhook event
    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      const primaryEmail = email_addresses.find(
        (email: { id: string }) => email.id === evt.data.primary_email_address_id
      );

      await ctx.runMutation(internal.users.upsertUser, {
        clerkId: id,
        email: primaryEmail?.email_address ?? "",
        name: [first_name, last_name].filter(Boolean).join(" ") || undefined,
        avatarUrl: image_url || undefined,
      });

      console.log(`User ${eventType === "user.created" ? "created" : "updated"}: ${id}`);
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      if (id) {
        await ctx.runMutation(internal.users.deleteUser, {
          clerkId: id,
        });

        console.log(`User deleted: ${id}`);
      }
    }

    return new Response("Webhook processed", { status: 200 });
  }),
});

// Type definitions for Clerk webhook events
interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      id: string;
      email_address: string;
    }>;
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
}

export default http;
