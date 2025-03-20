"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "tel" | "date" | "select" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  rows?: number;
  addButton?: {
    label: string;
    onClick: () => void;
  };
};

export type FormSection = {
  title?: string;
  description?: string;
  fields: FieldConfig[];
  className?: string;
};

export type GenericFormProps<T> = {
  title: string;
  initialData: T;
  sections: FormSection[];
  schema: z.ZodType<T>;
  onSubmit: (data: T) => Promise<void>;
  isSubmitting: boolean;
  cancelPath: string;
  submitButtonText?: string;
  cancelButtonText?: string;
};

export function GenericForm<T extends Record<string, any>>({
  title,
  initialData,
  sections,
  schema,
  onSubmit,
  isSubmitting,
  cancelPath,
  submitButtonText = "Enregistrer",
  cancelButtonText = "Annuler",
}: GenericFormProps<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? null : Number(value),
      });
    } else if (type === "date") {
      setFormData({
        ...formData,
        [name]: value ? new Date(value) : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value === "" ? null : value,
      });
    }
  };

  const validateForm = (): boolean => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitError(null);

    try {
      await onSubmit(formData);
      toast({
        title: "Succès",
        description: "Enregistrement réussi",
        variant: "success",
      });
      // Redirect after successful form submission
      navigate(cancelPath);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setSubmitError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const renderField = (field: FieldConfig) => {
    const {
      name,
      label,
      type,
      required,
      placeholder,
      options,
      min,
      max,
      rows,
      addButton,
    } = field;
    const value = formData[name as keyof T];
    const error = errors[name as string];
    const formattedValue =
      value && typeof value === "object" && "toISOString" in value
        ? value.toISOString().split("T")[0]
        : value === null || value === undefined
        ? ""
        : String(value);

    const commonProps = {
      id: name,
      name,
      value: formattedValue,
      onChange: handleChange,
      required,
      placeholder,
      className: `shadow appearance-none border ${
        error ? "border-red-500" : ""
      } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`,
    };

    const renderLabel = () => (
      <div
        className={`${
          addButton ? "flex justify-between items-center" : ""
        } mb-2`}
      >
        <label className="block text-gray-700 text-sm font-bold" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {addButton && (
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 text-sm"
            onClick={addButton.onClick}
          >
            {addButton.label}
          </button>
        )}
      </div>
    );

    const renderError = () =>
      error && <p className="text-red-500 text-xs italic">{error}</p>;

    switch (type) {
      case "textarea":
        return (
          <div className="mb-4">
            {renderLabel()}
            <textarea {...commonProps} rows={rows || 3} />
            {renderError()}
          </div>
        );
      case "select":
        return (
          <div className="mb-4">
            {renderLabel()}
            <select {...commonProps}>
              <option value="">Sélectionnez une option</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {renderError()}
          </div>
        );
      case "number":
        return (
          <div className="mb-4">
            {renderLabel()}
            <input {...commonProps} type="number" min={min} max={max} />
            {renderError()}
          </div>
        );
      default:
        return (
          <div className="mb-4">
            {renderLabel()}
            <input {...commonProps} type={type} />
            {renderError()}
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className={`${section.className || ""} ${
              sectionIndex > 0 ? "mt-6" : ""
            }`}
          >
            {section.title && (
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                {section.title}
              </h3>
            )}
            {section.description && (
              <p className="text-sm text-gray-500 mb-4">
                {section.description}
              </p>
            )}
            {section.fields.map((field) => renderField(field))}
          </div>
        ))}

        <div className="flex items-center justify-between mt-6">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : submitButtonText}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-gray-500 hover:bg-gray-700 text-white"
            onClick={() => navigate(cancelPath)}
          >
            {cancelButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
