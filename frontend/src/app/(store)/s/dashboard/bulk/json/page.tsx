"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { config } from "@/lib/config";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/auth-context/auth-context";
import { useSearchParams } from "next/navigation";

export default function BulkJsonUploadPage() {
  const { token } = useAuth();
  const slug = useSearchParams().get("slug");
  const [rawJson, setRawJson] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [catJson, setCatJson] = useState([]);


  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const res = await fetch(`${config.backend_url}/api/category/${slug}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
        );

        const data = await res.json();
        setCatJson(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to get all categories");
      }
    }
    getAllCategory();

  }, [slug, token])

  const handleSubmit = async () => {
    setError(null);
    setResponse(null);

    try {
      // Parse JSON
      let parsed;
      try {
        // Normalize input: allow user to paste without array brackets
        const fixed = rawJson.trim().startsWith("[")
          ? rawJson
          : `[${rawJson}]`;

        parsed = JSON.parse(fixed);
      } catch {
        setError("Invalid JSON format. Please check your input.");
        return;
      }

      setLoading(true);

      const res = await fetch(`${config.backend_url}/api/menu/${slug}/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      console.log("RES", data)
      setResponse(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Bulk Upload via JSON</h1>

      <Card>
        <CardContent className="space-y-4">
          <Textarea
            rows={10}
            placeholder={`Paste JSON here, e.g.\n{\n  "name": "Product 1",\n  "price": 20\n},\n{\n  "name": "Product 2",\n  "price": 40\n}`}
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white"
          >
            {loading ? "Uploading..." : "Upload JSON"}
          </Button>

          {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
          )}
        </CardContent>
      </Card>
      {
        catJson && (
          <div>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(catJson, null, 2)}
            </pre>
          </div>
        )
      }
      {response && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold">Response:</h2>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}