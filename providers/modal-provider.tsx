'use client'

import StoreModal from "@/components/modals/store-modal"
import { useEffect, useState } from "react"

    const ModalProvider = () => {
    const [isMounted, setIsmounted] = useState(false)

    useEffect(()=>{
        setIsmounted(true)
    }, [])

    if (!isMounted) {
        return null
    }
    return (<><StoreModal/></>
        
    )
}
export default ModalProvider