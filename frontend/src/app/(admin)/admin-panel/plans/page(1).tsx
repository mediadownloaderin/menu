"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Save,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Crown,
  Star,
  CreditCard,
  Calendar,
  Zap,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { Skeleton } from "@/components/ui/skeleton";
import BouncingDotsLoader from "@/components/ui/bounce-loader";

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  type: "monthly" | "yearly" | "lifetime";
  features: string[];
  cta: string;
  popular: boolean;
  createdAt: number;
}

export default function PricingPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  const [formData, setFormData] = useState<Omit<Plan, 'id' | 'createdAt'>>({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    type: "monthly",
    features: [""],
    cta: "Get Plan",
    popular: false,
  });

  useEffect(() => {
    getPlans();
  }, []); 

  const getPlans = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${config.backend_url}/api/admin/plans`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch plans");
      }
      
      const data = await res.json();
      setPlans(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pricing plans");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      type: "monthly",
      features: [""],
      cta: "Get Plan",
      popular: false,
    });
    setEditingPlan(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (plan: Plan) => {
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      originalPrice: plan.originalPrice,
      type: plan.type,
      features: plan.features.length > 0 ? plan.features : [""],
      cta: plan.cta,
      popular: plan.popular,
    });
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const savePlan = async () => {
    try {
      setIsSaving(true);

      // Filter out empty features
      const filteredFeatures = formData.features.filter(feature => feature.trim() !== "");

      const planData = {
        ...formData,
        features: filteredFeatures,
      };

      const url = editingPlan 
        ? `${config.backend_url}/api/admin/plans/${editingPlan.id}`
        : `${config.backend_url}/api/admin/plans`;

      const method = editingPlan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(planData),
      });

      if (!res.ok) {
        throw new Error("Failed to save plan");
      }

      await getPlans();
      setDialogOpen(false);
      resetForm();
      
      toast.success(editingPlan ? "Plan updated successfully" : "Plan created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save plan");
    } finally {
      setIsSaving(false);
    }
  };

  const deletePlan = async (plan: Plan) => {
    try {
      const res = await fetch(`${config.backend_url}/api/admin/plans/${plan.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete plan");
      }

      await getPlans();
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
      
      toast.success("Plan deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete plan");
    }
  };

  const openDeleteDialog = (plan: Plan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const getPlanIcon = (type: Plan["type"]) => {
    switch (type) {
      case "monthly":
        return <Calendar className="h-4 w-4" />;
      case "yearly":
        return <CreditCard className="h-4 w-4" />;
      case "lifetime":
        return <Crown className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPlanColor = (type: Plan["type"]) => {
    switch (type) {
      case "monthly":
        return "bg-blue-100 text-blue-800";
      case "yearly":
        return "bg-green-100 text-green-800";
      case "lifetime":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };


  return (
    <>{
      isLoading?<BouncingDotsLoader/>:
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing Plans</h1>
          <p className="text-muted-foreground">Manage your subscription plans and pricing</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Plan
          </Button>
          <Button variant="outline" onClick={getPlans} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Plans Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Original Price</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead>CTA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {plan.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`flex items-center gap-1 w-fit ${getPlanColor(plan.type)}`}>
                      {getPlanIcon(plan.type)}
                      {plan.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{formatPrice(plan.price)}</div>
                  </TableCell>
                  <TableCell>
                    <div className={plan.originalPrice > plan.price ? "line-through text-muted-foreground" : ""}>
                      {formatPrice(plan.originalPrice)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm line-clamp-2">
                        {plan.features.slice(0, 2).join(", ")}
                        {plan.features.length > 2 && ` +${plan.features.length - 2} more`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.popular ? (
                      <Badge variant="default" className="flex items-center gap-1 w-fit">
                        <Star className="h-3 w-3" />
                        Popular
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{plan.cta}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(plan)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Plan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(plan)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Plan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {plans.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pricing Plans</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by creating your first pricing plan.
              </p>
              <Button onClick={openAddDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Edit Pricing Plan" : "Create New Pricing Plan"}
            </DialogTitle>
            <DialogDescription>
              {editingPlan 
                ? "Update the plan details and features."
                : "Add a new pricing plan to your subscription options."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Professional, Enterprise"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Plan Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "monthly" | "yearly" | "lifetime") => 
                    handleInputChange("type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this plan offers..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Current Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (₹)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  placeholder="0"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange("originalPrice", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta">Call-to-Action Text</Label>
              <Input
                id="cta"
                placeholder="e.g., Get Started, Buy Now"
                value={formData.cta}
                onChange={(e) => handleInputChange("cta", e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="popular">Mark as Popular</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight this plan as a popular choice
                </p>
              </div>
              <Switch
                id="popular"
                checked={formData.popular}
                onCheckedChange={(checked) => handleInputChange("popular", checked)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Features</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Feature
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={formData.features.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePlan} disabled={isSaving}>
              {isSaving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the plan &quot;{planToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => planToDelete && deletePlan(planToDelete)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    }</>
  );
}