import { useState, useEffect, useRef, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
   
    // Parameters 
    const [params, setParams] = useState({
        page: 1,
        limit: 9, 
        query: '',
        status: '',
        certification: '',
        createDate: ''
    });

    const timeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Handle parameter changes
    const handleChangeParams = useCallback(({ param, newValue }) => {
        setParams(prevParams => {
            if (param === 'query' || param === 'status' || param === 'certification' || param === 'createDate') {
                return {
                    ...prevParams,
                    [param]: newValue,
                    page: 1 
                };
            }
            return { ...prevParams, [param]: newValue };
        });
    }, []);

    // Format date 
    const formatDateParameter = (dateValue) => {
        if (!dateValue) return '';
        
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue;
        }
        
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        
        if (isNaN(date.getTime())) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };

    const fetchTests = useCallback(async () => {
        // Cancel previous request if it exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);
        
        try {
            const api = apiWithAuth();
            
            // Create query parameters
            const queryParams = new URLSearchParams();
            
            queryParams.append('limit', params.limit);
            queryParams.append('page', params.page);
            
            if (params.query) queryParams.append('query', params.query);
            if (params.status) queryParams.append('status', params.status);
            if (params.certification) queryParams.append('certification', params.certification);
            
            if (params.createDate) {
                const formattedDate = formatDateParameter(params.createDate);
                if (formattedDate) queryParams.append('date', formattedDate);
            }
            
            console.log("Fetching tests with params:", params);
            const response = await api.get(`/admin/test?${queryParams.toString()}`, {
                signal: abortControllerRef.current.signal
            });
            
            if (response.data?.data?.tests && Array.isArray(response.data.data.tests)) {
                const testsData = response.data.data.tests.map(test => ({
                    id: test.id,
                    name: test.title || "Untitled Test",
                    description: [test.subject, test.class].filter(Boolean).join(" - ") || "No description",
                    status: test.status === "DRAFT" ? "Draft" : "Published",
                    certificationAvailable: Boolean(test.certificationAvailable),
                    total_questions: test.questions?.length || 0,
                    duration: test.duration || null,
                    pass_percentage: test.pass_percentage || test.totalMarks || "N/A",
                    created_by: test.created_by || "Admin",
                    createdAt: test.createdAt || new Date().toISOString()
                }));
                
                setTests(testsData);
                
                // FIXED: Extract pagination from correct location
                const { totalPages, currentPage, count } = response.data.data;
                setTotalPages(totalPages || 1);
                setTotalItems(count || 0);
                
                console.log("Pagination:", { totalPages, currentPage, count });
            } else {
                console.warn("Unexpected API response structure:", response.data);
                setTests([]);
                setTotalPages(1);
                setTotalItems(0);
            }
        } catch (err) {
            // Don't set error if request was aborted
            if (err.name === 'AbortError' || err.name === 'CanceledError') {
                console.log("Request was cancelled");
                return;
            }
            
            console.error("Error fetching tests:", err);
            setTests([]);
            setError(err.response?.data?.message || "Failed to fetch tests");
            setTotalPages(1);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, [params]);

    // Effect to handle fetch with debounce for search
    useEffect(() => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Debounce search queries
        if (params.query !== undefined && params.query !== null) {
            timeoutRef.current = setTimeout(() => {
                fetchTests();
            }, 500);
        } else {
            fetchTests();
        }

        // Cleanup function
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            // Abort ongoing request when component unmounts or params change
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [params, fetchTests]);

    return { 
        tests, 
        loading, 
        error, 
        handleChangeParams, 
        params,
        totalPages,
        totalItems,
        refetch: fetchTests 
    };
};

export default useFetchTests;
