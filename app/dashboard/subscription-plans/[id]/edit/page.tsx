"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditSubscriptionPlanPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchRecord() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) setError(error.message);
      else setRecord(data);
      setFetching(false);
    }
    fetchRecord();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const updates: Record<string, unknown> = {
      plan_name: formData.get("plan_name"),
      slug: formData.get("slug"),
      price_monthly: formData.get("price_monthly") ? Number(formData.get("price_monthly")) : null,
      stripe_price_id: formData.get("stripe_price_id"),
      pages_send_limit: formData.get("pages_send_limit") ? Number(formData.get("pages_send_limit")) : null,
      pages_receive_limit: formData.get("pages_receive_limit") ? Number(formData.get("pages_receive_limit")) : null,
      fax_numbers_included: formData.get("fax_numbers_included") ? Number(formData.get("fax_numbers_included")) : null,
      team_members_limit: formData.get("team_members_limit") ? Number(formData.get("team_members_limit")) : null,
      contacts_limit: formData.get("contacts_limit") ? Number(formData.get("contacts_limit")) : null,
      has_api_access: formData.get("has_api_access") === "on",
      has_priority_support: formData.get("has_priority_support") === "on",
    };

    const { error: updateError } = await supabase
      .from("subscription_plans")
      .update(updates)
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/subscription-plans");
      router.refresh();
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm text-red-700">Subscription Plan not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/subscription-plans" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Subscription Plans
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Subscription Plan</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="plan_name" className="label">Plan Name</label>
          <input id="plan_name" name="plan_name" type="text" className="input" defaultValue={String(record.plan_name ?? "")} required />
        </div>
        <div>
          <label htmlFor="slug" className="label">Slug</label>
          <input id="slug" name="slug" type="text" className="input" defaultValue={String(record.slug ?? "")} required />
        </div>
        <div>
          <label htmlFor="price_monthly" className="label">Price Monthly</label>
          <input id="price_monthly" name="price_monthly" type="number" className="input" defaultValue={String(record.price_monthly ?? "")} step="0.01" />
        </div>
        <div>
          <label htmlFor="stripe_price_id" className="label">Stripe Price Id</label>
          <input id="stripe_price_id" name="stripe_price_id" type="text" className="input" defaultValue={String(record.stripe_price_id ?? "")} />
        </div>
        <div>
          <label htmlFor="pages_send_limit" className="label">Pages Send Limit</label>
          <input id="pages_send_limit" name="pages_send_limit" type="number" className="input" defaultValue={String(record.pages_send_limit ?? "")} required />
        </div>
        <div>
          <label htmlFor="pages_receive_limit" className="label">Pages Receive Limit</label>
          <input id="pages_receive_limit" name="pages_receive_limit" type="number" className="input" defaultValue={String(record.pages_receive_limit ?? "")} required />
        </div>
        <div>
          <label htmlFor="fax_numbers_included" className="label">Fax Numbers Included</label>
          <input id="fax_numbers_included" name="fax_numbers_included" type="number" className="input" defaultValue={String(record.fax_numbers_included ?? "")} />
        </div>
        <div>
          <label htmlFor="team_members_limit" className="label">Team Members Limit</label>
          <input id="team_members_limit" name="team_members_limit" type="number" className="input" defaultValue={String(record.team_members_limit ?? "")} />
        </div>
        <div>
          <label htmlFor="contacts_limit" className="label">Contacts Limit</label>
          <input id="contacts_limit" name="contacts_limit" type="number" className="input" defaultValue={String(record.contacts_limit ?? "")} required />
        </div>
        <div className="flex items-center gap-3">
          <input id="has_api_access" name="has_api_access" type="checkbox" defaultChecked={!!record.has_api_access} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          <label htmlFor="has_api_access" className="text-sm font-medium text-gray-700">Has Api Access</label>
        </div>
        <div className="flex items-center gap-3">
          <input id="has_priority_support" name="has_priority_support" type="checkbox" defaultChecked={!!record.has_priority_support} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          <label htmlFor="has_priority_support" className="text-sm font-medium text-gray-700">Has Priority Support</label>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Update Subscription Plan"}
          </button>
          <Link href="/dashboard/subscription-plans" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
