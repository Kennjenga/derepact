"use client";
import React from "react";

export default function App() {
  const [formData, setFormData] = React.useState({
    email: "",
    vehicleType: "",
    workArea: "",
    idNumber: "",
    dateOfBirth: "",
    idPhoto: null,
    psvPhoto: null,
    licensePhoto: null,
    goodConductPhoto: null,
  });

  const [errors, setErrors] = React.useState<{
    email: string | null;
    vehicleType?: string | null;
    workArea?: string | null;
    idNumber?: string | null;
    dateOfBirth?: string | null;
    idPhoto?: string | null;
    psvPhoto?: string | null;
    licensePhoto?: string | null;
    goodConductPhoto?: string | null;
  }>({
    email: null,
    vehicleType: null,
    workArea: null,
    idNumber: null,
    dateOfBirth: null,
    idPhoto: null,
    psvPhoto: null,
    licensePhoto: null,
    goodConductPhoto: null,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateDocuments = async (file: File | null) => {
    if (!file) return "File is required.";
    // Simulate AI validation
    const isValid = await new Promise((resolve) =>
      setTimeout(() => resolve(true), 1000)
    );
    return isValid ? null : "Invalid document.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: {
      email: string | null;
      vehicleType?: string | null;
      workArea?: string | null;
      idNumber?: string | null;
      dateOfBirth?: string | null;
      idPhoto?: string | null;
      psvPhoto?: string | null;
      licensePhoto?: string | null;
      goodConductPhoto?: string | null;
    } = {
      email: null,
      vehicleType: null,
      workArea: null,
      idNumber: null,
      dateOfBirth: null,
      idPhoto: null,
      psvPhoto: null,
      licensePhoto: null,
      goodConductPhoto: null,
    };
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.vehicleType)
      newErrors.vehicleType = "Vehicle type is required.";
    if (!formData.workArea) newErrors.workArea = "Work area is required.";
    if (!formData.idNumber) newErrors.idNumber = "ID number is required.";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required.";

    // Validate documents using AI
    newErrors.idPhoto = await validateDocuments(formData.idPhoto);
    newErrors.psvPhoto = await validateDocuments(formData.psvPhoto);
    newErrors.licensePhoto = await validateDocuments(formData.licensePhoto);
    newErrors.goodConductPhoto = await validateDocuments(
      formData.goodConductPhoto
    );

    setErrors(newErrors);
    setIsSubmitting(false);

    if (
      Object.keys(newErrors).every(
        (key) => !newErrors[key as keyof typeof newErrors]
      )
    ) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4">
          Step Two: Driver Information
        </h2>
        <p className="mb-6 text-gray-600">
          This is information pertaining to your driver expertise.
        </p>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Which vehicle are you licensed to drive *
          </label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Car">Car</option>
            <option value="Bus">Bus</option>
            <option value="Truck">Truck</option>
          </select>
          {errors.vehicleType && (
            <p className="text-red-500 text-sm">{errors.vehicleType}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Work Area *</label>
          <select
            name="workArea"
            value={formData.workArea}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Urban">Urban</option>
            <option value="Rural">Rural</option>
          </select>
          {errors.workArea && (
            <p className="text-red-500 text-sm">{errors.workArea}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">ID Number *</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.idNumber && (
            <p className="text-red-500 text-sm">{errors.idNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth *</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">ID Photo *</label>
          <input
            type="file"
            name="idPhoto"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.idPhoto && (
            <p className="text-red-500 text-sm">{errors.idPhoto}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">PSV Photo *</label>
          <input
            type="file"
            name="psvPhoto"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.psvPhoto && (
            <p className="text-red-500 text-sm">{errors.psvPhoto}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">License Photo *</label>
          <input
            type="file"
            name="licensePhoto"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.licensePhoto && (
            <p className="text-red-500 text-sm">{errors.licensePhoto}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Good Conduct Photo *</label>
          <input
            type="file"
            name="goodConductPhoto"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.goodConductPhoto && (
            <p className="text-red-500 text-sm">{errors.goodConductPhoto}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />I agree to the terms and
            conditions and privacy policy
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
