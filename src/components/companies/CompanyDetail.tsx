import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getCompanyById,
  updateCompany,
  deleteCompany,
} from '@/api/companies';
import {
  getCompanyRepresentatives,
  addCompanyRepresentative,
  updateCompanyRepresentative,
  deleteCompanyRepresentative,
} from '@/api/companyRepresentatives';
import { getVacancies } from '@/api/vacancies';
import { Company, CompanyContact, Vacancy } from '@/api/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash, Pencil, X } from 'lucide-react';

interface CompanyDetailProps {
  companyId: string;
}

const emptyContact: Partial<CompanyContact> = {
  firstName: '',
  lastName: '',
  middleName: '',
  position: '',
  phones: [''],
  emails: [''],
};

const CompanyDetail = ({ companyId }: CompanyDetailProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Partial<Company>>({});
  const [editingContact, setEditingContact] = useState<Record<string, boolean>>({});
  const [editContactValues, setEditContactValues] = useState<Partial<CompanyContact>>({});
  const [newContact, setNewContact] = useState<Partial<CompanyContact>>(emptyContact);

  useEffect(() => {
    console.log('CompanyDetail mounted/updated with companyId:', companyId);
  }, [companyId]);

  const { data: company, isLoading: isLoadingCompany, error: companyError } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompanyById(companyId).then(res => res.data),
    enabled: !!companyId,
  });

  const { data: reps, isLoading: isLoadingReps, error: repsError } = useQuery({
    queryKey: ['companyReps', companyId],
    queryFn: () => getCompanyRepresentatives(companyId),
    enabled: !!companyId,
  });

  const { data: vacancies, isLoading: isLoadingVacancies, error: vacanciesError } = useQuery({
    queryKey: ['vacancies', { companyId }],
    queryFn: () => getVacancies(1, 100, { companyId }).then(res => res.data),
    enabled: !!companyId,
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) => updateCompany(id, data),
    onSuccess: () => {
      toast.success('Company updated successfully');
      queryClient.invalidateQueries({ queryKey: ['company', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsEditing({});
    },
    onError: (err: Error) => {
      toast.error(`Failed to update company: ${err.message}`);
    },
  });

  const addRepMutation = useMutation({
    mutationFn: (payload: Partial<CompanyContact>) => addCompanyRepresentative(companyId, payload),
    onSuccess: () => {
      toast.success('Representative added!');
      queryClient.invalidateQueries({ queryKey: ['companyReps', companyId] });
      setNewContact({ ...emptyContact });
    },
    onError: (err: Error) => {
      toast.error(`Error adding representative: ${err.message}`);
    },
  });

  const updateRepMutation = useMutation({
    mutationFn: ({ repId, payload }: { repId: string; payload: Partial<CompanyContact> }) =>
      updateCompanyRepresentative(companyId, repId, payload),
    onSuccess: () => {
      toast.success('Representative updated!');
      queryClient.invalidateQueries({ queryKey: ['companyReps', companyId] });
      setEditingContact({});
      setEditContactValues({});
    },
    onError: (err: Error) => {
      toast.error(`Error updating representative: ${err.message}`);
    },
  });

  const deleteRepMutation = useMutation({
    mutationFn: (repId: string) => deleteCompanyRepresentative(companyId, repId),
    onSuccess: () => {
      toast.success('Representative removed!');
      queryClient.invalidateQueries({ queryKey: ['companyReps', companyId] });
    },
    onError: (err: Error) => {
      toast.error(`Error deleting representative: ${err.message}`);
    },
  });

  const deleteCompanyMutation = useMutation(() => deleteCompany(companyId), {
    onSuccess: () => {
      toast.success('Company deleted');
      queryClient.invalidateQueries(['companies']);
      setConfirmOpen(false);
      navigate('/companies');
    },
    onError: (err: Error) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const handleEdit = (field: string) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
    setEditedValues(prev => ({ ...prev, [field]: company?.[field as keyof Company] }));
  };

  const handleSave = (field: string) => {
    if (editedValues[field as keyof Partial<Company>] !== undefined) {
      let dataField: any = {};
      if (field === 'legalName') dataField.legalName = editedValues.legalName;
      else if (field === 'industry') dataField.industry = editedValues.industry;
      else dataField[field] = editedValues[field as keyof Partial<Company>];
      updateCompanyMutation.mutate({ id: companyId, data: dataField });
    }
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const handleCancel = (field: string) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setEditedValues(prev => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (field: string, value: any) => {
    setEditedValues(prev => ({ ...prev, [field]: value }));
  };

  const handleEditContactToggle = (contact: CompanyContact) => {
    setEditingContact(prev => ({ ...prev, [contact.id]: !prev[contact.id] }));
    setEditContactValues({
      ...contact,
      phones: [contact.phones[0] || ''],
      emails: [contact.emails[0] || ''],
    });
  };

  const handleEditContactChange = (field: keyof CompanyContact, value: any) => {
    setEditContactValues(prev => ({ ...prev, [field]: value }));
  };

  const handleEditContactPhoneChange = (value: string) => {
    setEditContactValues(prev => ({ ...prev, phones: [value] }));
  };

  const handleEditContactEmailChange = (value: string) => {
    setEditContactValues(prev => ({ ...prev, emails: [value] }));
  };

  const handleEditContactSave = (contact: CompanyContact) => {
    updateRepMutation.mutate({
      repId: contact.id,
      payload: {
        first_name: editContactValues.firstName ?? '',
        last_name: editContactValues.lastName ?? '',
        middle_name: editContactValues.middleName ?? '',
        phone: editContactValues.phones?.[0] ?? '',
        email: editContactValues.emails?.[0] ?? '',
      },
    });
  };

  const handleEditContactCancel = (contactId: string) => {
    setEditingContact(prev => ({ ...prev, [contactId]: false }));
    setEditContactValues({});
  };

  const handleRemoveContact = (contactId: string) => {
    deleteRepMutation.mutate(contactId);
  };

  const handleAddContact = () => {
    if (!newContact.firstName || !newContact.lastName) {
      toast.error('First name and last name are required');
      return;
    }
    addRepMutation.mutate({
      first_name: newContact.firstName,
      last_name: newContact.lastName,
      middle_name: newContact.middleName || '',
      phone: newContact.phones?.[0] || '',
      email: newContact.emails?.[0] || '',
    });
  };

  const handleAddNewContactPhone = () => {
    setNewContact(prev => ({
      ...prev,
      phones: [...(prev.phones ?? []), ''],
    }));
  };

  const handleAddNewContactEmail = () => {
    setNewContact(prev => ({
      ...prev,
      emails: [...(prev.emails ?? []), ''],
    }));
  };

  console.log("🚀 RENDER Company:", company);
  console.log("📇 Contacts:", company.contacts);
  if (isLoadingCompany || isLoadingReps || isLoadingVacancies) {
    return <div className="p-4 text-center">Loading company details...</div>;
  }

  if (companyError || !company) {
    return <div className="p-4 text-center text-red-500">Error loading company details</div>;
  }

  if (repsError) {
    return <div className="p-4 text-center text-red-500">Error loading representatives</div>;
  }

  if (vacanciesError) {
    return <div className="p-4 text-center text-red-500">Error loading vacancies</div>;
  }

  const companyContacts = reps ?? [];
  const companyVacancies = vacancies ?? [];


  return (
    <div className="h-full scrollable-container p-4">
      <div className="card-container mb-4">
        <h2 className="text-lg font-bold mb-4 text-recruitflow-brownDark uppercase">О КОМПАНИИ</h2>

        <div className="space-y-4">
          {/* Company Name */}
          <div>
            <Label>Название компании</Label>
            {isEditing.name ? (
              <div className="mt-1 flex space-x-2">
                <Input
                  value={editedValues.name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                  className="input-field"
                />
                <Button size="sm" onClick={() => handleSave('name')}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleCancel('name')}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="mt-1 flex justify-between items-center">
                <Input value={company.name} readOnly className="input-field bg-gray-100 cursor-default" />
                <Button variant="ghost" size="sm" onClick={() => handleEdit('name')}>
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Legal Name */}
          <div>
            <Label>Юридическое название компании</Label>
            {isEditing.legalName ? (
              <div className="mt-1 flex space-x-2">
                <Input
                  value={editedValues.legalName || ''}
                  onChange={e => handleChange('legalName', e.target.value)}
                  className="input-field"
                />
                <Button size="sm" onClick={() => handleSave('legalName')}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleCancel('legalName')}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="mt-1 flex justify-between items-center">
                <Input
                  value={company.legalName || ''}
                  readOnly
                  className="input-field bg-gray-100 cursor-default"
                />
                <Button variant="ghost" size="sm" onClick={() => handleEdit('legalName')}>
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Industry */}
          <div>
            <Label>Сфера деятельности</Label>
            {isEditing.industry ? (
              <div className="mt-1 flex space-x-2">
                <Input
                  value={editedValues.industry || ''}
                  onChange={e => handleChange('industry', e.target.value)}
                  className="input-field"
                />
                <Button size="sm" onClick={() => handleSave('industry')}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleCancel('industry')}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="mt-1 flex justify-between items-center">
                <Input
                  value={company.industry || ''}
                  readOnly
                  className="input-field bg-gray-100 cursor-default"
                />
                <Button variant="ghost" size="sm" onClick={() => handleEdit('industry')}>
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-container mb-4">
        <h2 className="text-lg font-bold mb-4 text-recruitflow-brownDark uppercase">ОПИСАНИЕ КОМПАНИИ</h2>

        {isEditing.description ? (
          <div className="space-y-2">
            <Textarea
              value={editedValues.description || ''}
              onChange={e => handleChange('description', e.target.value)}
              className="input-field min-h-[100px]"
              placeholder="Введите описание компании..."
            />
            <div className="flex justify-end space-x-2">
              <Button size="sm" onClick={() => handleSave('description')}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleCancel('description')}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-md p-3 border border-recruitflow-beigeDark min-h-[100px]">
              {company.description || 'No description available.'}
            </div>
            <div className="mt-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => handleEdit('description')}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="card-container mb-4">
        <h2 className="text-lg font-bold mb-4 text-recruitflow-brownDark uppercase">ПРЕДСТАВИТЕЛИ КОМПАНИИ</h2>

        <div className="space-y-6">
          {companyContacts.map((contact, index) => (
            <div
              key={contact.id}
              className="border-b border-dashed border-recruitflow-beigeDark pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">
                  {index + 1}. {contact.firstName} {contact.middleName || ''} {contact.lastName}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditContactToggle(contact)}
                  >
                    {editingContact[contact.id] ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Pencil className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveContact(contact.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {editingContact[contact.id] ? (
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <div>
                      <Label>Фамилия</Label>
                      <Input
                        value={editContactValues.lastName || ''}
                        onChange={(e) => handleEditContactChange('lastName', e.target.value)}
                        className="input-field"
                        placeholder="Фамилия"
                      />
                    </div>
                    <div>
                      <Label>Имя</Label>
                      <Input
                        value={editContactValues.firstName || ''}
                        onChange={(e) => handleEditContactChange('firstName', e.target.value)}
                        className="input-field"
                        placeholder="Имя"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Отчество</Label>
                    <Input
                      value={editContactValues.middleName || ''}
                      onChange={(e) => handleEditContactChange('middleName', e.target.value)}
                      className="input-field"
                      placeholder="Отчество"
                    />
                  </div>
                  <div className="flex items-center">
                    <Label className="w-24">Телефон</Label>
                    <Input
                      value={editContactValues.phones?.[0] ?? ''}
                      onChange={(e) => handleEditContactPhoneChange(e.target.value)}
                      className="input-field"
                      placeholder="+998 99 999 99 99"
                    />
                  </div>
                  <div className="flex items-center">
                    <Label className="w-24">Почта</Label>
                    <Input
                      value={editContactValues.emails?.[0] ?? ''}
                      onChange={(e) => handleEditContactEmailChange(e.target.value)}
                      className="input-field"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={() => handleEditContactSave(contact)}>
                      Сохранить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditContactCancel(contact.id)}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 ml-2">
                  <div>
                    <span className="font-medium">Телефон: </span>
                    {contact.phones?.[0] || <span className="text-gray-400">Нет</span>}
                  </div>
                  <div>
                    <span className="font-medium">Почта: </span>
                    {contact.emails?.[0] || <span className="text-gray-400">Нет</span>}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add new contact form */}
          <div className="border-t border-recruitflow-beigeDark pt-4 mt-4">
            <h3 className="font-medium mb-3">Добавить представителя</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Фамилия</Label>
                  <Input
                    value={newContact.lastName || ''}
                    onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                    className="input-field"
                    placeholder="Фамилия"
                  />
                </div>
                <div>
                  <Label>Имя</Label>
                  <Input
                    value={newContact.firstName || ''}
                    onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                    className="input-field"
                    placeholder="Имя"
                  />
                </div>
              </div>
              <div>
                <Label>Отчество</Label>
                <Input
                  value={newContact.middleName || ''}
                  onChange={(e) => setNewContact({ ...newContact, middleName: e.target.value })}
                  className="input-field"
                  placeholder="Отчество"
                />
              </div>
              <div className="flex items-center">
                <Label className="w-24">Телефон</Label>
                <Input
                  value={newContact.phones?.[0] || ''}
                  onChange={(e) => setNewContact({ ...newContact, phones: [e.target.value] })}
                  className="input-field"
                  placeholder="+998 99 999 99 99"
                />
              </div>
              <div className="flex items-center">
                <Label className="w-24">Почта</Label>
                <Input
                  value={newContact.emails?.[0] || ''}
                  onChange={(e) => setNewContact({ ...newContact, emails: [e.target.value] })}
                  className="input-field"
                  placeholder="email@example.com"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddContact}>Добавить представителя</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-container">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Кем создан</Label>
            <Input value={company.createdBy} readOnly className="input-field bg-gray-100" />
          </div>
          <div>
            <Label>Когда создан</Label>
            <Input
              value={new Date(company.createdAt).toLocaleDateString()}
              readOnly
              className="input-field bg-gray-100"
            />
          </div>
          {company.updatedBy && (
            <>
              <div>
                <Label>Кем изменен</Label>
                <Input value={company.updatedBy} readOnly className="input-field bg-gray-100" />
              </div>
              <div>
                <Label>Когда изменен</Label>
                <Input
                  value={company.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : ''}
                  readOnly
                  className="input-field bg-gray-100"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline">
            Открыть историю изменений
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Удалить компанию
          </Button>
        </div>
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Подтверждение удаления</h3>
            <p className="mb-6">Вы уверены, что хотите удалить компанию? Это действие нельзя отменить.</p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Отмена
              </Button>
              <Button variant="destructive" onClick={() => deleteCompanyMutation.mutate()}>
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;