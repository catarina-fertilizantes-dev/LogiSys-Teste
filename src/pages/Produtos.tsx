import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth"; // Supondo que você tenha esse hook

type Unidade = "t" | "kg" | "";

const unidadeLabels: Record<string, string> = {
  t: "Toneladas (t)",
  kg: "Quilos (kg)",
};

type Produto = Database['public']['Tables']['produtos']['Row'];

const Produtos = () => {
  const { toast } = useToast();
  const { canAccess, loading: permissionsLoading } = usePermissions();
  const { user, userRole } = useAuth(); // ajuste para seu hook de auth real

  // LOGS para debug
  useEffect(() => {
    console.log("DEBUG - Permissão produtos read:", canAccess('produtos', 'read'));
    console.log("DEBUG - Permissão produtos create:", canAccess('produtos', 'create'));
    console.log("DEBUG - Permissão produtos update:", canAccess('produtos', 'update'));
    console.log("DEBUG - Permissão produtos delete:", canAccess('produtos', 'delete'));
    console.log("DEBUG - userRole:", userRole);
    console.log("DEBUG - user:", user);
    console.log("DEBUG - permissionsLoading:", permissionsLoading);
  }, [canAccess, userRole, user, permissionsLoading]);

  // Dados
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Novo Produto Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    unidade: "" as Unidade,
  });

  const [detalhesProduto, setDetalhesProduto] = useState<Produto | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");

  // Mensagens de debug no UI
  useEffect(() => {
    if (!permissionsLoading && !canAccess('produtos', 'read')) {
      toast({
        variant: "destructive",
        title: "Permissão negada em Produtos",
        description: `Seu usuário (${userRole}) não tem acesso para ler produtos.`,
      });
    }
  }, [permissionsLoading, userRole, canAccess, toast]);

  if (permissionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando permissões...</p>
        </div>
      </div>
    );
  }

  if (!canAccess("produtos", "read")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-semibold text-lg">
            Acesso negado
          </p>
          <p className="text-muted-foreground mt-2">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            <b>Debug:</b> userRole: {userRole?.toString()}, canAccess: {canAccess("produtos", "read").toString()}, permissionsLoading: {permissionsLoading.toString()}
          </p>
        </div>
      </div>
    );
  }

  // ...demais código igual, sem os logs!
  // O restante do componente permanece igual ao template que já enviei antes.
  // Adicione mais console.log conforme precisar em outros pontos sensíveis do fluxo.
};
export default Produtos;
