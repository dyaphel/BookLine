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


📌 Classificazione tabella IFPUG ILF (DET=10, RET=1) → **Bassa complessità → 7 FP**

---

## 2. CustomUser

**Attributi:**  
`email, first_name, last_name, username, profile_image, role, is_active, is_staff, password`

- **Tipo:** ILF (il sistema mantiene utenti).  
- **DET:** = 9 (campi significativi).  
- **RET:** 1 (insieme logico: utenti).  

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

# Function Point Analysis – Bookline (User Stories)

# Function Point Analysis – Bookline (User Stories) – Corretto

| #  | User Story                                  | ILF FP | EIF FP | EI FP | EO FP | EQ FP | Totale FP |
|:--:|:--------------------------------------------|:------:|:------:|:-----:|:-----:|:-----:|:---------:|
| 1  | Browse all books                            | 7      | 0      | 0     | 0     | 3     | 10        |
| 2  | Search books (author, genre, title, date)   | 7      | 0      | 0     | 0     | 3     | 10        |
| 3  | Filter & sort catalog                       | 7      | 0      | 0     | 0     | 3     | 10        |
| 4  | Create personal account                     | 7      | 0      | 4     | 0     | 0     | 11        |
| 5  | Log in                                      | 7      | 0      | 0     | 0     | 3     | 10        |
| 6  | Log out                                     | 7      | 0      | 0     | 0     | 3     | 10        |
| 7  | View detailed book info                     | 7      | 0      | 0     | 0     | 3     | 10        |
| 8  | Reserve book                                | 7      | 0      | 4     | 0     | 0     | 11        |
| 9  | Receive reservation confirmation            | 7      | 0      | 0     | 4     | 0     | 11        |
| 10 | Join waitlist                               | 7      | 0      | 4     | 0     | 0     | 11        |
| 11 | Notification for turn to collect book       | 7      | 0      | 0     | 4     | 0     | 11        |
| 12 | View personal area (reservations, stats)    | 7      | 0      | 0     | 0     | 4     | 11        |
| 13 | Edit profile                                | 7      | 0      | 4     | 0     | 0     | 11        |
| 14 | Receive book recommendations                | 7      | 0      | 0     | 4     | 0     | 11        |
| 15 | Delete account                              | 7      | 0      | 4     | 0     | 0     | 11        |
| 16 | Add/delete books                            | 7      | 0      | 4     | 0     | 0     | 11        |
| 17 | Process/edit book info                      | 7      | 0      | 4     | 0     | 0     | 11        |
| 18 | Reservation management page                 | 7      | 0      | 0     | 0     | 3     | 10        |
| 19 | Scan QR code to verify reservation          | 7      | 0      | 4     | 0     | 0     | 11        |
| 20 | Access dashboard (trends, stats)            | 7      | 0      | 0     | 4     | 0     | 11        |
