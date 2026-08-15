'use client'

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { useStoreModal } from "@/hooks/use-store-modal"
import Modal from "@/components/ui/modal"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
})


const StoreModal = () => {

  const [loading, setLoading] = useState(false);

  const storeModal = useStoreModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
  
      const response = await axios.post('/api/stores', values);
  
      console.log(response.data);
      toast.success("berhasil membuat toko");  
      window.location.assign(`/${response.data.id}`)
     
      
  
    } catch (error) {
      toast.error("gagal membuat toko");
    } finally {
      setLoading(false);
    }
  }
  


  return (
    <Modal
      title="Store Form"
      description="Please fill the form"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Toko"
                      {...field}
                      disabled = {loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button  disabled = {loading} type="button" variant="outline" onClick={storeModal.onClose}>
                Cancel
              </Button>
              <Button  disabled = {loading} type="submit">Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
}

export default StoreModal
