"use client";

import { useState } from "react";
import { createPaymentAccount, deletePaymentAccount, updatePaymentAccount, updateTransferEnabled, type PaymentAccountInput } from "./payment-actions";

type Account = PaymentAccountInput & { id: string };
const empty: PaymentAccountInput = {bank_name:"",account_type:"Ahorros",account_number:"",account_holder:"",identification:"",contact_email:"",qr_url:"",enabled:true};

export function PaymentAccountsManager({initialAccounts,transferEnabled}:{initialAccounts:Account[];transferEnabled:boolean}) {
  const [accounts,setAccounts]=useState(initialAccounts);
  const [enabled,setEnabled]=useState(transferEnabled);
  const [editing,setEditing]=useState<string|null>(null);
  const [form,setForm]=useState<PaymentAccountInput>(empty);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");

  const update=(field:keyof PaymentAccountInput,value:string|boolean)=>setForm(v=>({...v,[field]:value}));
  const edit=(a:Account)=>{setEditing(a.id);setForm({bank_name:a.bank_name,account_type:a.account_type,account_number:a.account_number,account_holder:a.account_holder,identification:a.identification??"",contact_email:a.contact_email??"",qr_url:a.qr_url??"",enabled:a.enabled});setMessage("")};
  const cancel=()=>{setEditing(null);setForm(empty);setMessage("")};

  async function save(e:React.FormEvent){e.preventDefault();setSaving(true);setMessage("");try{
    if(editing){await updatePaymentAccount(editing,form);setAccounts(v=>v.map(a=>a.id===editing?{...a,...form}:a));setMessage("Cuenta actualizada.");cancel();}
    else{await createPaymentAccount(form);window.location.reload();}
  }catch(err){setMessage(err instanceof Error?err.message:"No se pudo guardar.");}finally{setSaving(false)}}

  async function remove(id:string){if(!window.confirm("¿Eliminar esta cuenta bancaria?"))return;try{await deletePaymentAccount(id);setAccounts(v=>v.filter(a=>a.id!==id));}catch(err){setMessage(err instanceof Error?err.message:"No se pudo eliminar.")}}
  async function toggle(){const next=!enabled;setEnabled(next);try{await updateTransferEnabled(next)}catch(err){setEnabled(!next);setMessage(err instanceof Error?err.message:"No se pudo actualizar.")}}

  return <div className="space-y-6">
    <section className="rounded-2xl border border-border bg-background p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-semibold">Transferencia / QR</h2><p className="mt-1 text-sm text-muted-foreground">Administra varias cuentas sin mantener un formulario largo.</p></div>
        <button type="button" onClick={toggle} className={`rounded-xl px-4 py-2 text-sm font-medium ${enabled?"bg-primary text-primary-foreground":"border border-border"}`}>{enabled?"Transferencia habilitada":"Transferencia deshabilitada"}</button>
      </div>
    </section>

    <section className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center justify-between"><div><h2 className="font-semibold">{editing?"Editar cuenta":"Agregar banco"}</h2><p className="mt-1 text-sm text-muted-foreground">Los datos secundarios se mantienen en una sola fila cuando sea posible.</p></div>{editing&&<button type="button" onClick={cancel} className="text-sm text-muted-foreground hover:text-foreground">Cancelar</button>}</div>
      <form onSubmit={save} className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {([["bank_name","Banco"],["account_type","Tipo"],["account_number","Número"],["account_holder","Titular"],["identification","Cédula / RUC"],["contact_email","Correo"],["qr_url","QR (URL)"]] as const).map(([field,label])=><label key={field} className="space-y-1"><span className="text-[11px] font-medium text-muted-foreground">{label}</span><input value={form[field]} onChange={e=>update(field,e.target.value)} className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"/></label>)}
        <label className="flex items-end gap-2 pb-2 text-xs"><input type="checkbox" checked={form.enabled} onChange={e=>update("enabled",e.target.checked)}/>Activa</label>
        <div className="col-span-2 flex items-end justify-end gap-2 md:col-span-4"><button type="submit" disabled={saving} className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60">{saving?"Guardando...":editing?"Guardar cambios":"Agregar banco"}</button></div>
      </form>
      {message&&<p className="mt-4 rounded-lg bg-secondary px-3 py-2 text-sm">{message}</p>}
    </section>

    <section className="space-y-3">
      {accounts.length===0&&<div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">Todavía no hay cuentas bancarias configuradas.</div>}
      {accounts.map(a=><article key={a.id} className="rounded-2xl border border-border bg-background p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{a.bank_name}</h3><span className="rounded-full bg-secondary px-2 py-1 text-xs">{a.account_type}</span><span className="rounded-full bg-secondary px-2 py-1 text-xs">{a.enabled?"Activa":"Inactiva"}</span></div><p className="mt-1 text-sm text-muted-foreground">{a.account_number} · {a.account_holder}</p></div>
          <div className="flex gap-2"><button type="button" onClick={()=>edit(a)} className="rounded-lg border border-border px-3 py-2 text-sm">Editar</button><button type="button" onClick={()=>remove(a.id)} className="rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive">Eliminar</button></div>
        </div>
      </article>)}
    </section>
  </div>;
}