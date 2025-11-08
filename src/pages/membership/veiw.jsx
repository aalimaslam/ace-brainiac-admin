import { X } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";


export default function ViewMembership({ 
    membership, 
    isOpen, 
    onClose, 
    onDelete,
    formatPrice,
    formatDate 
}) {
    if (!isOpen || !membership) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <Card className="m-0 border-0 shadow-none">
                    {/* Modal Header */}
                    <div className="flex justify-between items-start mb-4 pb-3 border-b">
                        <h2 className="text-xl font-bold text-gray-800">
                            Membership Details
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="space-y-4">
                        {/* Title Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-1">
                                Title
                            </h3>
                            <p className="text-base font-medium">
                                {membership.title}
                            </p>
                        </div>

                        {/* Description Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-1">
                                Description
                            </h3>
                            <p className="text-sm text-gray-700">
                                {membership.body}
                            </p>
                        </div>

                        {/* Price and Duration Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-3 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                                    Price
                                </h3>
                                <p className="text-lg font-bold text-green-700">
                                    {formatPrice(membership.price)}
                                </p>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                                    Duration
                                </h3>
                                <p className="text-lg font-bold text-blue-700">
                                    {membership.duration} Days
                                </p>
                            </div>
                        </div>

                        {/* For Section */}
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-600 mb-1">
                                Membership For
                            </h3>
                            <p className="text-base font-medium text-purple-700">
                                {membership.for}
                            </p>
                        </div>

                        {/* Limits Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">
                                Usage Limits
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Students Limit</p>
                                    <p className="text-lg font-bold text-blue-700">
                                        {membership.studentsLimit === 0 ? 'Unlimited' : membership.studentsLimit}
                                    </p>
                                </div>

                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Teachers Limit</p>
                                    <p className="text-lg font-bold text-green-700">
                                        {membership.teachersLimit === 0 ? 'Unlimited' : membership.teachersLimit}
                                    </p>
                                </div>

                                <div className="bg-orange-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Tests Limit</p>
                                    <p className="text-lg font-bold text-orange-700">
                                        {membership.testsLimit === 0 ? 'Unlimited' : membership.testsLimit}
                                    </p>
                                </div>

                                <div className="bg-pink-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Worksheets Limit</p>
                                    <p className="text-lg font-bold text-pink-700">
                                        {membership.worksheetsLimit === 0 ? 'Unlimited' : membership.worksheetsLimit}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* System Information */}
                        <div className="space-y-3 pt-3 border-t">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                System Information
                            </h3>
                            
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                    Membership ID:
                                </span>
                                <span className="text-sm text-gray-800 font-mono">
                                    {membership.id}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                    Created Date:
                                </span>
                                <span className="text-sm text-gray-800">
                                    {formatDate(membership.createdAt)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                    Last Updated:
                                </span>
                                <span className="text-sm text-gray-800">
                                    {formatDate(membership.updatedAt)}
                                </span>
                            </div>

                            {membership.deletedAt && (
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-600">
                                        Deleted Date:
                                    </span>
                                    <span className="text-sm text-red-600">
                                        {formatDate(membership.deletedAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button
                            variant="delete"
                            onClick={() => {
                                onClose();
                                onDelete(membership);
                            }}
                        >
                            Delete Membership
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
