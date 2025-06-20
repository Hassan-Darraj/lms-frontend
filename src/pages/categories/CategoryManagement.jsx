import { useState } from 'react';
import Layout from '../../components/common/Layout';
import CategoryList from '../../components/category/CategoryList';
import CategoryForm from '../../components/category/CategoryForm';
import DeleteCategoryConfirm from '../../components/category/DeleteCategoryConfirm';
import SuccessMessage from '../../components/common/SuccessMessage';
import ErrorMessage from '../../components/common/ErrorMessage';

const CategoryManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateCategory = () => {
    setShowCreateForm(true);
    setSelectedCategory(null);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditForm(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setShowDeleteConfirm(true);
  };

  const handleSuccess = (action) => {
    setMessage(`Category ${action} successfully!`);
    setError('');
    setRefreshTrigger(prev => prev + 1);
    closeAllModals();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
    setMessage('');
  };

  const closeAllModals = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowDeleteConfirm(false);
    setSelectedCategory(null);
  };

  return (
    <Layout showSidebar={true}>
      <div className="category-management">
        <div className="page-header">
          <h1>Category Management</h1>
          <button onClick={handleCreateCategory} className="primary-button">
            Add New Category
          </button>
        </div>
        

        {message && <SuccessMessage message={message} />}
        {error && <ErrorMessage message={error} />}

        <CategoryList
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          refreshTrigger={refreshTrigger}
        />

        {showCreateForm && (
          <CategoryForm
            onSuccess={() => handleSuccess('created')}
            onCancel={closeAllModals}
          />
        )}

        {showEditForm && selectedCategory && (
          <CategoryForm
            categoryId={selectedCategory.id}
            onSuccess={() => handleSuccess('updated')}
            onCancel={closeAllModals}
          />
        )}

        {showDeleteConfirm && selectedCategory && (
          <DeleteCategoryConfirm
            category={selectedCategory}
            onSuccess={() => handleSuccess('deleted')}
            onCancel={closeAllModals}
          />
        )}
      </div>
    </Layout>
  );
};

export default CategoryManagement;
