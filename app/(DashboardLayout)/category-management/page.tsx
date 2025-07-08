"use client";
import { Category } from "@/components/icons/Category";
import { Home } from "@/components/icons/Home";
import { Material } from "@/components/icons/Material";
import { Service } from "@/components/icons/Service";
import { Tool } from "@/components/icons/Tool";
import { Trade } from "@/components/icons/Trade";
import { RoleCard } from '@/components/shared/cards/RoleCard';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Edit2, Trash } from 'iconsax-react';
import type { FC } from "react";
import React, { useState } from "react";

const ICONS: FC<{ className?: string }>[] = [Category, Home, Service, Tool, Trade, Material];

interface CategoryType {
  iconSrc: FC<{ className?: string }>;
  name: string;
  description: string;
}

// Update initialCategories to match RoleCard props
const initialCategories = [
  {
    iconSrc: Category,
    iconBgColor: '#34AD4426',
    title: 'Full Home Build/Addition',
    description: 'Start a new home from scratch or add a room, floor, or extension to your existing space.',
    permissionCount: 0,
    color: '#34AD44',
  },
  {
    iconSrc: Service,
    iconBgColor: '#1A57BF1A',
    title: 'Interior',
    description: 'Renovate or upgrade interiors like kitchen, bathroom, living room, or complete home redesign.',
    permissionCount: 0,
    color: '#1A57BF',
  },
  {
    iconSrc: Home,
    iconBgColor: '#00A8BF26',
    title: 'Exterior',
    description: 'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
    permissionCount: 0,
    color: '#00A8BF',
  },
  {
    iconSrc: Tool,
    iconBgColor: '#EBB40226',
    title: 'Single/Multi Trade',
    description: 'Get help with one or more specific trades like plumbing, electrical, flooring, or carpentry.',
    permissionCount: 0,
    color: '#EBB402',
  },
  {
    iconSrc: Material,
    iconBgColor: '#90C91D26',
    title: 'Repair',
    description: 'Fix issues like leaks, cracks, broken fixtures, or any small-scale home damage.',
    permissionCount: 0,
    color: '#90C91D',
  },
];

const menuOptions = [
  { label: 'Edit', action: 'edit', icon: Edit2 },
  { label: 'Delete', action: 'delete', icon: Trash },
];

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [open, setOpen] = useState(false);
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const [form, setForm] = useState({
    iconSrc: Category,
    iconBgColor: '#34AD4426',
    title: '',
    description: '',
    permissionCount: 0,
    color: '#34AD44',
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIconChange = (iconSrc: any, iconBgColor: string, color: string) => {
    setForm({ ...form, iconSrc, iconBgColor, color });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCategories([...categories, { ...form, iconSrc: form.iconSrc ?? Category }]);
    setForm({ iconSrc: ICONS[0] ?? Category, name: "", description: "" });
    setOpen(false);
  };

  const handleMenuAction = (action: string, idx: number) => {
    if (action === 'edit') {
      setEditIndex(idx);
      setForm(categories[idx] ? { ...categories[idx], iconSrc: categories[idx].iconSrc ?? Category } : { ...form, iconSrc: Category });
      setEditOpen(true);
    } else if (action === 'delete') {
      // Optionally implement delete logic here
    }
  };

  return (
    <section className="flex flex-col w-full items-start gap-8 p-6 overflow-y-auto">
      <header className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium text-[var(--text-dark)]">
          Category Management
        </h2>
        <Button className="h-[42px] px-6 bg-[#34AD44] rounded-full font-semibold text-white px-6" onClick={() => setOpen(true)}>
          Create Category
        </Button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {categories.map((cat, idx) => (
          <RoleCard
            key={idx}
            onToggle={() => {}}
            menuOptions={menuOptions}
            onMenuAction={action => handleMenuAction(action, idx)}
            iconSrc={cat.iconSrc}
            iconBgColor={cat.iconBgColor}
            title={cat.title}
            description={cat.description}
            permissionCount={cat.permissionCount}
            iconColor={cat.color}
          />
        ))}
      </div>
      {/* Sheet for Create Category remains, update its form to match new structure if needed */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="left" className="max-w-md w-full h-full p-8 bg-white">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
          </SheetHeader>
          <form onSubmit={e => {
            e.preventDefault();
            if (editIndex !== null) {
              const updated = [...categories];
              updated[editIndex] = { ...form };
              setCategories(updated);
            }
            setEditOpen(false);
          }} className="space-y-6 mt-8">
            {/* Same form fields as create, prefilled with form state */}
            {/* ...reuse icon picker, title, description fields... */}
            <div className="flex gap-4 justify-end mt-4">
              <Button type="button" variant="outline" className="rounded-full px-8 py-2 text-base border" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-full px-8 py-2 text-base bg-green-600 hover:bg-green-700 text-white">
                Save
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
} 