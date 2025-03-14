import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDialogStore } from "@/stores/dialog-store";
import ServiceDialog from "./ServiceDialog";
import { ServiceFormValues } from "@/components/userFormSchema";

interface LitDialogProps {
  onLitCreated?: (newLit: any) => void;
  services?: ServiceFormValues[]; // Liste des services disponibles
}

const LitDialog: React.FC<LitDialogProps> = ({
  onLitCreated,
  services: initialServices = [],
}) => {
  const {
    showLitDialog,
    setShowLitDialog,
    litForm,
    updateLitField,
    submitLitForm,
    activeFieldRef,
    setActiveFieldRef,
    setShowServiceDialog,
  } = useDialogStore();

  // État local pour gérer les services (permettant de les mettre à jour lors de l'ajout)
  const [services, setServices] =
    useState<ServiceFormValues[]>(initialServices);

  // Mettre à jour l'état local lorsque les props changent
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  // Créer une référence pour le focus si elle n'existe pas déjà
  const localActiveFieldRef = useRef<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
  >(null);

  // Initialiser la référence dans le store si nécessaire
  useEffect(() => {
    if (!activeFieldRef) {
      setActiveFieldRef(localActiveFieldRef);
    }
  }, [activeFieldRef, setActiveFieldRef]);

  // Référence à utiliser (celle du store ou la locale)
  const fieldRef = activeFieldRef || localActiveFieldRef;

  const handleLitChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Sauvegarder la référence au champ actif
    fieldRef.current = e.target;

    // Mettre à jour le champ dans le store
    updateLitField(name as keyof typeof litForm, value);

    // Remettre le focus après le rendu
    setTimeout(() => {
      if (fieldRef.current) {
        fieldRef.current.focus();
      }
    }, 0);
  };

  const handleSelectChange = (value: string, field: string) => {
    updateLitField(field as keyof typeof litForm, value);
  };

  const handleSubmit = async () => {
    try {
      await submitLitForm(onLitCreated);
    } catch (error) {
      console.error("Erreur lors de la création du lit:", error);
    }
  };

  // Callback pour l'ajout d'un nouveau service
  const handleServiceCreated = (newService: ServiceFormValues) => {
    setServices((prev) => [...prev, newService]);
    updateLitField("serviceId", newService.id as string);
  };

  return (
    <Dialog open={showLitDialog} onOpenChange={setShowLitDialog}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau lit</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-4 py-4">
          {/* Première colonne */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="lit-numeroLit" className="text-right">
                Numéro du lit
              </Label>
              <Input
                id="lit-numeroLit"
                name="numeroLit"
                value={litForm.numeroLit}
                onChange={handleLitChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="lit-chambre" className="text-right">
                Chambre
              </Label>
              <Input
                id="lit-chambre"
                name="chambre"
                value={litForm.chambre ?? ""}
                onChange={handleLitChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="lit-serviceId" className="text-right">
                Service
              </Label>
              <div className="col-span-3 flex items-center">
                <Select
                  value={litForm.serviceId ?? ""}
                  onValueChange={(value) =>
                    handleSelectChange(value, "serviceId")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id as string}>
                        {service.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() => setShowServiceDialog(true)}
                  className="ml-2 text-sm text-blue-600 hover:text-blue-800 flex-shrink-0"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="lit-type" className="text-right">
                Type
              </Label>
              <Select
                value={litForm.type ?? ""}
                onValueChange={(value) => handleSelectChange(value, "type")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un type de lit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Médicalisé">Médicalisé</SelectItem>
                  <SelectItem value="Électrique">Électrique</SelectItem>
                  <SelectItem value="Pédiatrique">Pédiatrique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deuxième colonne */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="lit-statut" className="text-right">
                Statut
              </Label>
              <Select
                value={litForm.statut ?? "Disponible"}
                onValueChange={(value) => handleSelectChange(value, "statut")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Occupé">Occupé</SelectItem>
                  <SelectItem value="En maintenance">En maintenance</SelectItem>
                  <SelectItem value="Hors service">Hors service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="lit-etage" className="text-right">
                Étage
              </Label>
              <Input
                id="lit-etage"
                name="etage"
                value={litForm.etage ?? ""}
                onChange={handleLitChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="lit-patientId" className="text-right">
                Patient (opt.)
              </Label>
              <Input
                id="lit-patientId"
                name="patientId"
                value={litForm.patientId ?? ""}
                onChange={handleLitChange}
                className="col-span-3"
                placeholder="ID du patient assigné"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowLitDialog(false)}
          >
            Annuler
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Créer le lit
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Intégration du Dialog de service */}
      <ServiceDialog onServiceCreated={handleServiceCreated} />
    </Dialog>
  );
};

export default LitDialog;
