package com.swann.SVLibrary.copy;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CopyDTO {
    private String id;
    private String bookId;
    private Boolean isAvailable;
}
