import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import MyAlert from '../../components/AlertComponents/Alert'
import Link from 'next/link'
export default function Edit() {
    const [productList, setProductList] = useState<any>([])
    const [product, setProduct] = useState<any>({})
    const params = useRouter()
    const params_id = params.query.id as string
    const [productName, setProductName] = useState<string>('')
    const [productPrice, setProductPrice] = useState<number>()
    const [error, setError] = useState<boolean>(false)


    // Get all Products
    useEffect(() => {
        const data = window.localStorage.getItem('ProductList')
        if (data != null) {
            const Items = JSON.parse(data);
            setProductList(Items)
        }
    }, [])

    // Get Product_by_id
    useEffect(() => {
        const product_for_edit = productList.filter((item: any) => (item.id).toString() == params_id)
        setProduct(product_for_edit)
    }, [productList, params_id])


    const handleEditProduct = (e: any) => {
        e.preventDefault()
        if (productPrice == undefined && productName == '') {
            setError(true)
            return false
        } else {
            const updatedData: { id: number, name: string, price: number } = {
                id: parseInt(params_id),
                name: productName || product[0].name,
                price: productPrice || product[0].price
            }
            const list_product_deleted_element: any = productList.filter((item: any) => item.id != params_id)
            const updatedProductList: any = [updatedData, ...list_product_deleted_element]
            window.localStorage.setItem('ProductList', JSON.stringify(updatedProductList))
            MyAlert.Toast('success', 'Product updated successfully')
            setError(false)
            setTimeout(() => {
                params.push('/')
            }, 1000);
        }
    }

    return (
        <div className='form-container'>
            <h3 className='text-4xl text-center mt-5'>Edit Product</h3>
            <form className="todo-list flex flex-col justify-center items-center gap-4 mt-5 ">
                <div className="flex flex-col gap-4 mt-5 border-[1px] border-[dodger-blue] p-5 bg-[#e1dddd] rounded-lg">
                    <p>Edit ProductId: {product[0]?.id}</p>
                    <div className="form-group flex gap-4">
                        <label htmlFor="name" className="min-w-[150px]">
                            Product name
                        </label>
                        <input
                            required={true}
                            defaultValue={product[0]?.name}
                            type="text"
                            id="name"
                            className="border-[1px] border-[dodgerblue] w-[200px] h-[40px] pl-2"
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 flex justify-end -mt-3 mr-12">Name do not change</p>}
                    <div className="form-group flex gap-4">
                        <label htmlFor="price" className="min-w-[150px]">
                            Price
                        </label>
                        <input
                            required={true}
                            defaultValue={product[0]?.price}
                            type="number"
                            id="price"
                            className="border-[1px] border-[dodgerblue] w-[200px] h-[40px] pl-2"
                            onChange={(e) => setProductPrice(parseInt(e.target.value))}
                        />
                    </div>
                    {error && <p className="text-red-500 flex justify-end -mt-3 mr-12">Price do not change</p>}
                    <div className='flex justify-around'>
                        <Link
                            href={'/'}
                            type="button"
                            className="w-[100px] px-4 py-2 bg-[#d95b79] hover:bg-[#ea889f] text-white text-center rounded-md 
                            border border-white"
                        >
                            Back
                        </Link>
                        <button
                            type="submit"
                            className="w-[100px] active:translate-y-1 hover:bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 rounded-md 
						    border border-white bg-[dodgerblue] text-white "
                            onClick={handleEditProduct}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
