# Function Point Analysis del Sistema

## Concetti di base

In **Function Point Analysis (FPA)** ogni entità persistente (tabella/oggetto salvato in DB) è classificata come:

- **ILF (Internal Logical File):** dati mantenuti dal sistema, creati/aggiornati al suo interno.  
- **EIF (External Interface File):** dati usati solo in lettura dal sistema, ma mantenuti da un altro sistema.  

Altri concetti fondamentali:  
- **DET (Data Element Type):** campi elementari distinguibili a livello utente (gli attributi che contano).  
- **RET (Record Element Type):** raggruppamenti logici di dati riconosciuti a livello utente (es. una tabella intera o sotto-gruppi logici).  
- **FTR (File Type Referenced):** numero di file (ILF/EIF) referenziati da una transazione.  
- **EI (External Input):** funzionalità che inseriscono/modificano/cancellano dati.  
- **EO (External Output):** output con elaborazioni, report, calcoli.  
- **EQ (External Inquiry):** interrogazioni (input + output senza logica complessa).  

---

## 1. Book

**Attributi:**  
`isbn, title, description, abstract, author, published, cover, genre, language, available_copies`

- **Tipo:** ILF (il sistema mantiene i libri).  
- **DET:** 10 (ogni campo significativo a livello utente).  
- **RET:** 1 (un solo insieme logico: i libri).  

**Funzioni tipiche:**  
- **EI:** Aggiungere libro, Modificare libro, Eliminare libro  
  - FTR = 1 (il file Book stesso)  
- **EO/EQ:** Consultare lista libri, cercare libro  

📌 Classificazione tabella IFPUG ILF (DET=10, RET=1) → **Bassa complessità → 7 FP**

---

## 2. CustomUser

**Attributi:**  
`email, first_name, last_name, username, profile_image, role, is_active, is_staff, password`

- **Tipo:** ILF (il sistema mantiene utenti).  
- **DET:** ≈ 9 (campi significativi).  
- **RET:** 1 (insieme logico: utenti).  

**Funzioni tipiche:**  
- **EI:** Registrazione utente, Aggiornamento profilo, Cancellazione utente  
  - FTR = 1 (CustomUser stesso)  
- **EQ/EO:** Login, visualizzazione profilo  

📌 Classificazione ILF (DET=9, RET=1) → **Bassa complessità → 7 FP**

---

## 3. Reservation

**Attributi:**  
`user (FK), book (FK), timestamp, fulfilled, ready_for_pickup, returned, position, cancelled`

- **Tipo:** ILF (il sistema gestisce le prenotazioni).  
- **DET:** 8 (ogni attributo distinto, FK inclusi).  
- **RET:** 1 (insieme logico: prenotazioni).  

**Funzioni tipiche:**  
- **EI:**  
  - Creazione prenotazione (FTR=3 → Reservation + Book + User)  
  - Annullamento prenotazione (FTR=1 → Reservation)  
  - Restituzione libro (FTR=2 → Reservation + Book)  
- **EQ/EO:** Lista prenotazioni attive, posizione in coda  

📌 Classificazione ILF (DET=8, RET=1) → **Bassa complessità → 7 FP**

---

## Sintesi ILF

| Modello     | Tipo | DET | RET | FP (ILF) |
|-------------|------|-----|-----|----------|
| Book        | ILF  | 10  | 1   | 7        |
| CustomUser  | ILF  | 9   | 1   | 7        |
| Reservation | ILF  | 8   | 1   | 7        |

**Totale = 21 FP solo per i file logici interni.**

---

## Sintesi Transazioni (EI, EO, EQ – con FTR)

| Transazione               | Tipo | DET stimati | FTR | Complessità | FP |
|---------------------------|------|-------------|-----|-------------|----|
| Aggiungi Libro            | EI   | 10          | 1   | Media       | 4  |
| Elimina Libro             | EI   | 1           | 1   | Bassa       | 3  |
| Lista/Cerca Libri         | EQ   | 5           | 1   | Bassa       | 3  |
| Registrazione Utente      | EI   | 9           | 1   | Media       | 4  |
| Modifica/Cancella Utente  | EI   | 3-5         | 1   | Bassa       | 3  |
| Login                     | EQ   | 2-3         | 1   | Bassa       | 3  |
| Crea Prenotazione         | EI   | 8           | 3   | Alta        | 6  |
| Annulla Prenotazione      | EI   | 2-3         | 1   | Bassa       | 3  |
| Restituzione Libro        | EI   | 2-3         | 2   | Media       | 4  |
| Lista Prenotazioni / Coda | EQ   | 5           | 2   | Media       | 4  |

📌 FP stimati con tabella standard IFPUG:  
- **EI → 3 (bassa), 4 (media), 6 (alta)**  
- **EO → 4 (bassa), 5 (media), 7 (alta)**  
- **EQ → 3 (bassa), 4 (media), 6 (alta)**  

---

# Conclusione

- **Totale ILF:** 21 FP  
- **Totale Transazioni (EI/EQ):** somma delle singole FP sopra → **37 FP**  
- **Totale generale del sistema:** **58 Function Point**
