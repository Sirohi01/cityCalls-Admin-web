'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const mockBrands = [
  { id: 'BR-001', name: 'LG', category: 'Appliance, HVAC', active: true },
  { id: 'BR-002', name: 'Samsung', category: 'Appliance, HVAC', active: true },
];

const mockProductTypes = [
  { id: 'PT-001', name: 'Split AC', category: 'HVAC', active: true },
  { id: 'PT-002', name: 'Front Load Washing Machine', category: 'Appliance', active: true },
];

const mockModels = [
  { id: 'MOD-001', brand: 'LG', productType: 'Split AC', name: 'Dual Inverter 1.5T', active: true },
];

import { useBrands } from '@/lib/hooks/useBrands';

export default function BrandsPage() {
  const [activeTab, setActiveTab] = useState('brands');
  const { data: brandsData, isLoading } = useBrands();
  
  const brands = brandsData || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands & Product Types</h1>
          <p className="text-muted-foreground">Manage the appliance catalog hierarchy.</p>
        </div>
        <Button>
          {activeTab === 'brands' ? 'Add Brand' : activeTab === 'product-types' ? 'Add Product Type' : 'Add Model'}
        </Button>
      </div>

      <Tabs defaultValue="brands" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="product-types">Product Types</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="brands">
          <Card>
            <CardContent className="pt-6">
              <DataTable 
                data={brands}
                columns={[
                  { key: 'name', header: 'Brand Name' },
                  { key: 'category', header: 'Supported Categories' },
                  { 
                    key: 'active', 
                    header: 'Status',
                    render: (item) => <StatusBadge label={item.active ? 'Active' : 'Inactive'} category={item.active ? 'success' : 'default'} />
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product-types">
          <Card>
            <CardContent className="pt-6">
              <DataTable 
                data={mockProductTypes}
                columns={[
                  { key: 'name', header: 'Product Type' },
                  { key: 'category', header: 'Category' },
                  { 
                    key: 'active', 
                    header: 'Status',
                    render: (item) => <StatusBadge label={item.active ? 'Active' : 'Inactive'} category={item.active ? 'success' : 'default'} />
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardContent className="pt-6">
              <DataTable 
                data={mockModels}
                columns={[
                  { key: 'name', header: 'Model Name' },
                  { key: 'brand', header: 'Brand' },
                  { key: 'productType', header: 'Product Type' },
                  { 
                    key: 'active', 
                    header: 'Status',
                    render: (item) => <StatusBadge label={item.active ? 'Active' : 'Inactive'} category={item.active ? 'success' : 'default'} />
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
